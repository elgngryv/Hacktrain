package az.hacktrain.auth;

import az.hacktrain.app.HackTrainApplication;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.*;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.junit.jupiter.*;
import java.time.*;
import java.util.*;
import java.util.concurrent.*;
import static org.assertj.core.api.Assertions.*;

@Testcontainers
@SpringBootTest(classes=HackTrainApplication.class,webEnvironment=SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles({"test","dev"})
class AuthFlowIT {
    @Container static PostgreSQLContainer<?> postgres=new PostgreSQLContainer<>("postgres:17-alpine");
    @Container static GenericContainer<?> redis=new GenericContainer<>("redis:7.4-alpine").withExposedPorts(6379);
    @DynamicPropertySource static void properties(DynamicPropertyRegistry r) {
        r.add("spring.datasource.url",postgres::getJdbcUrl); r.add("spring.datasource.username",postgres::getUsername); r.add("spring.datasource.password",postgres::getPassword);
        r.add("spring.flyway.url",postgres::getJdbcUrl); r.add("spring.flyway.user",postgres::getUsername); r.add("spring.flyway.password",postgres::getPassword);
        r.add("spring.data.redis.url",()->"redis://"+redis.getHost()+":"+redis.getMappedPort(6379));
        r.add("hacktrain.rate-limit.redis-uri",()->"redis://"+redis.getHost()+":"+redis.getMappedPort(6379));
        r.add("hacktrain.auth.jwt-secret",()->Base64.getEncoder().encodeToString(new byte[32]));
        r.add("hacktrain.auth.frontend-url",()->"http://localhost:5173");
        r.add("hacktrain.auth.cors-origins",()->"http://localhost:5173");
        r.add("management.server.port",()->"0");
    }
    @Autowired AuthRetention retention; @Autowired AuthService service; @Autowired JdbcTemplate jdbc;
    @Autowired TestRestTemplate http; @Autowired org.springframework.data.redis.core.StringRedisTemplate redisTemplate;
    final String password="12345678";
    @BeforeEach void clearRateLimit() { jdbc.update("update user_account set blocked=false where email=?",StaticAccount.EMAIL); jdbc.update("delete from refresh_session"); redisTemplate.execute((org.springframework.data.redis.core.RedisCallback<Object>)c->{c.serverCommands().flushDb(); return null;}); }
    String newEmail() { return UUID.randomUUID()+"@example.com"; }
    String verifiedUser() { return StaticAccount.EMAIL; }
    AuthDtos.Tokens login(String email) { return service.login(new AuthDtos.Login(email,password)); }
    ResponseEntity<String> me(String token) { var h=new HttpHeaders(); h.setBearerAuth(token); return http.exchange("/api/v1/auth/me",HttpMethod.GET,new HttpEntity<>(h),String.class); }
    @Test void staticAccountLoginAndProfile() {
        String email=verifiedUser(); var tokens=login(email);
        assertThat(me(tokens.accessToken()).getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(me(tokens.accessToken()).getBody()).contains(email).doesNotContain("passwordHash","refreshToken");
        assertThat(jdbc.queryForObject("select token_hash from refresh_session where user_id=(select id from user_account where email=?)",String.class,email)).isNotEqualTo(tokens.refreshToken());
    }
    @Test void refreshReplayRevocationIsCommittedDespite401() {
        var first=login(verifiedUser()); var next=service.refresh(first.refreshToken());
        assertThatThrownBy(()->service.refresh(first.refreshToken())).isInstanceOf(AuthFailure.class);
        assertThatThrownBy(()->service.refresh(next.refreshToken())).isInstanceOf(AuthFailure.class);
        assertThat(jdbc.queryForObject("select count(*) from auth_event where event_type='REFRESH_REPLAY'",Integer.class)).isPositive();
    }
    @Test void concurrentRefreshHasOnlyOneWinnerAndRevokesFamily() throws Exception {
        var first=login(verifiedUser()); var latch=new CountDownLatch(1);
        try(var pool=Executors.newVirtualThreadPerTaskExecutor()) {
            Callable<AuthDtos.Tokens> task=()->{latch.await(); try{return service.refresh(first.refreshToken());}catch(AuthFailure e){return null;}};
            var a=pool.submit(task); var b=pool.submit(task); latch.countDown();
            var outcomes=Arrays.asList(a.get(10,TimeUnit.SECONDS),b.get(10,TimeUnit.SECONDS));
            assertThat(outcomes.stream().filter(Objects::nonNull).count()).isEqualTo(1);
            var winner=outcomes.stream().filter(Objects::nonNull).findFirst().orElseThrow();
            assertThatThrownBy(()->service.refresh(winner.refreshToken())).isInstanceOf(AuthFailure.class);
        }
    }



    @Test void loginRateLimitIsDistributedAndForwardedHeaderCannotBypassIt() {
        var headers=new HttpHeaders(); headers.setContentType(MediaType.APPLICATION_JSON);
        ResponseEntity<String> response=null;
        for(int i=0;i<21;i++) {
            headers.set("X-Forwarded-For","198.51.100."+i);
            response=http.postForEntity("/api/v1/auth/login",new HttpEntity<>(Map.of("email","invalid","password","x"),headers),String.class);
        }
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.TOO_MANY_REQUESTS);
        assertThat(response.getHeaders().getFirst("Retry-After")).isNotNull();
    }
    @Test void foreignOriginCannotReadApi() {
        var headers=new HttpHeaders(); headers.setOrigin("https://evil.example"); headers.set("Access-Control-Request-Method","POST");
        var response=http.exchange("/api/v1/auth/login",HttpMethod.OPTIONS,new HttpEntity<>(headers),String.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
        assertThat(response.getHeaders().getAccessControlAllowOrigin()).isNull();
    }
    @Test void blockingAccountInvalidatesExistingAccessToken() {
        var email=verifiedUser(); var tokens=login(email); jdbc.update("update user_account set blocked=true where email=?",email);
        assertThat(me(tokens.accessToken()).getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThatThrownBy(()->service.refresh(tokens.refreshToken())).isInstanceOf(AuthFailure.class);
    }

    @Test void logoutOnlyRevokesItsOwnFamilyAndLogoutAllRevokesAll() {
        var email=verifiedUser(); var a=login(email); var b=login(email); service.logout(a.refreshToken());
        assertThatThrownBy(()->service.refresh(a.refreshToken())).isInstanceOf(AuthFailure.class);
        var next=service.refresh(b.refreshToken()); var id=jdbc.queryForObject("select id from user_account where email=?",UUID.class,email);
        service.logoutAll(id); assertThatThrownBy(()->service.refresh(next.refreshToken())).isInstanceOf(AuthFailure.class);
        assertThat(me(b.accessToken()).getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }
    @Test void independentSessionsBelongToStaticAccount() {
        var a=login(StaticAccount.EMAIL); var b=login(StaticAccount.EMAIL);
        assertThat(a.refreshToken()).isNotEqualTo(b.refreshToken());
        assertThat(me(a.accessToken()).getBody()).contains(StaticAccount.EMAIL);
        assertThat(me(b.accessToken()).getBody()).contains(StaticAccount.EMAIL);
    }


    @Test void httpCredentialLifecycleUsesDtoValidationAndErrorContract() {
        String email=StaticAccount.EMAIL;
        var tokens=http.postForObject("/api/v1/auth/login",new AuthDtos.Login(email,password),AuthDtos.Tokens.class);
        var next=http.postForObject("/api/v1/auth/refresh",new AuthDtos.TokenRequest(tokens.refreshToken()),AuthDtos.Tokens.class);
        assertThat(next.refreshToken()).isNotEqualTo(tokens.refreshToken());
        assertThat(http.postForEntity("/api/v1/auth/logout",new AuthDtos.TokenRequest(next.refreshToken()),String.class).getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        var revoked=http.postForEntity("/api/v1/auth/refresh",new AuthDtos.TokenRequest(next.refreshToken()),String.class);
        assertThat(revoked.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED); assertThat(revoked.getHeaders().getContentType().toString()).contains("application/problem+json");
    }
    @Test void cleanupRetainsReplayDetectionUntilFamilyExpires() {
        var email=verifiedUser(); var token=login(email); service.refresh(token.refreshToken());
        var id=jdbc.queryForObject("select id from user_account where email=?",UUID.class,email);
        retention.purgeExpiredCredentials();
        assertThat(jdbc.queryForObject("select count(*) from refresh_session where user_id=?",Integer.class,id)).isEqualTo(2);
        jdbc.update("update refresh_session set expires_at=now()-interval '2 days' where user_id=?",id);
        retention.purgeExpiredCredentials();
        assertThat(jdbc.queryForObject("select count(*) from refresh_session where user_id=?",Integer.class,id)).isZero();
    }
    @Test void accountLoginLimitSurvivesIpChanges() {
        var email=verifiedUser(); for(int i=0;i<10;i++) login(email);
        assertThatThrownBy(()->login(email)).isInstanceOfSatisfying(AuthFailure.class,e->assertThat(e.status()).isEqualTo(HttpStatus.TOO_MANY_REQUESTS));
    }

    @Test void developmentOpenApiDocumentsOnlyImplementedEndpointsAndBearerAuth() {
        var response=http.getForEntity("/v3/api-docs",String.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).contains("/api/v1/auth/login","bearerAuth").doesNotContain("/lab-sessions");
        assertThat(http.getForEntity("/swagger-ui/index.html",String.class).getStatusCode()).isEqualTo(HttpStatus.OK);
    }
}
