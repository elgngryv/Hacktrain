package az.hacktrain.auth;

import jakarta.validation.constraints.*;
import java.time.Instant;
import java.util.UUID;

public final class AuthDtos {
    private AuthDtos() {}
    public record Login(@NotBlank @Email @Size(max=254) String email,
                        @NotBlank @Size(max=72) String password) {}
    public record TokenRequest(@NotBlank @Pattern(regexp="[A-Za-z0-9_-]{43}") String token) {}
    public record Tokens(String accessToken, String refreshToken, String tokenType, long expiresIn) {}
    public record Profile(UUID id, String email, boolean emailVerified, String platformRole, Instant createdAt) {}
}
