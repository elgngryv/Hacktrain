package az.hacktrain.auth;
import org.springframework.jdbc.core.JdbcTemplate;
import java.util.UUID;
/** Test-only fixture for existing organization members; no public registration or mail dependency. */
public class TestIdentityFactory {
    private final JdbcTemplate jdbc;
    private final AccessTokens tokens;
    public TestIdentityFactory(JdbcTemplate jdbc,AccessTokens tokens) { this.jdbc=jdbc; this.tokens=tokens; }
    public record Actor(UUID id,String email,String accessToken) {}
    public Actor create() {
        var user=new UserAccount(); user.id=UUID.randomUUID(); user.email=user.id+"@example.com"; user.platformRole="STUDENT";
        jdbc.update("insert into user_account(id,email,password_hash) values (?,?,?)",user.id,user.email,"unusable-test-password");
        return new Actor(user.id,user.email,tokens.issue(user));
    }
}
