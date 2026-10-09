package az.hacktrain.auth;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthService service;
    AuthController(AuthService service) { this.service=service; }
    @PostMapping("/login")
    public AuthDtos.Tokens login(@Valid @RequestBody AuthDtos.Login dto) { return service.login(dto); }
    @PostMapping("/refresh")
    public AuthDtos.Tokens refresh(@Valid @RequestBody AuthDtos.TokenRequest dto) { return service.refresh(dto.token()); }
    @PostMapping("/logout") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(@Valid @RequestBody AuthDtos.TokenRequest dto) { service.logout(dto.token()); }
    @PostMapping("/logout-all") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logoutAll(@AuthenticationPrincipal Jwt jwt) { service.logoutAll(UUID.fromString(jwt.getSubject())); }
    @GetMapping("/me")
    public AuthDtos.Profile me(@AuthenticationPrincipal Jwt jwt) { return service.profile(UUID.fromString(jwt.getSubject())); }
}
