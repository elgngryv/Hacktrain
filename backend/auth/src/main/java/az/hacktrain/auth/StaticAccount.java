package az.hacktrain.auth;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

/** Single configured account; password is stored only as a BCrypt hash. */
@Component
public class StaticAccount implements ApplicationRunner {
    public static final String EMAIL = "elgun@gmail.com";
    private final UserRepository users;
    private final PasswordEncoder passwords;
    private final RefreshRepository refresh;
    public StaticAccount(UserRepository users, PasswordEncoder passwords, RefreshRepository refresh) {
        this.users = users; this.passwords = passwords; this.refresh = refresh;
    }
    @Override
    @Transactional
    public void run(ApplicationArguments arguments) {
        users.insertIfAbsent(UUID.randomUUID(), EMAIL, passwords.encode("12345678"));
        var existing = users.findByEmail(EMAIL).orElseThrow();
        var user = users.lockById(existing.id).orElseThrow();
        if (!passwords.matches("12345678", user.passwordHash)) {
            user.passwordHash = passwords.encode("12345678");
            user.tokenVersion++;
            refresh.revokeUser(user.id);
        }
        user.emailVerified = true;
        user.blocked = false;
    }
}
