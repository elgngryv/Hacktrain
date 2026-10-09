# HackTrain backend

Java 21 / Spring Boot modular monolith: auth, organization, course və Groq/Claude/OpenAI inteqrasiyası.

## Giriş

Sabit hesab: **elgun@gmail.com**, parol **12345678**. Backend startup zamanı hesabı yaradır; mövcuddursa ID və təşkilat əlaqələrini saxlayır, parolu tələb olunan dəyərə uyğunlaşdırır. Bazada BCrypt hash saxlanır. Bu sabit hesab bütün istifadəçilər üçün eyni kimlikdir.

Qeydiyyat, mail təsdiqi, şifrə bərpası və dəyişdirilməsi endpoint-ləri çıxarılıb. SMTP, mail outbox və Mailpit yoxdur. V4 migrasiyası köhnə poçt növbəsini və verification/reset tokenlərini silir; istifadəçi və kurs məlumatları saxlanır. Təşkilat dəvəti yaradıldıqda `invitationUrl` yalnız həmin cavabda qaytarılır, linki əl ilə paylaşmaq olar.

## Lokal başlatma

Mövcud `.env` faylını saxlayın; ilk quraşdırmada `.env.example` əsasında yaradın. PostgreSQL/runtime DB, Redis və Grafana üçün parollar, JWT üçün `openssl rand -base64 32` nəticəsi lazımdır.

```sh
docker compose --env-file .env --env-file .env.groq.local up -d --build
```

Groq faylı istifadə edilmirsə ikinci `--env-file` hissəsini çıxarın. AI açarı yalnız backend environment-də saxlanır. API: `http://localhost:8081`, frontend origin: `http://localhost:8080`.

Lokal idarə olunan servislər PostgreSQL, Redis, migrator, app, Prometheus və Grafana-dır. Flyway əvvəl migrator ilə işləyir; app runtime DB rolundan istifadə edir. Mövcud DB volume-nu silməyin.

## Environment

- `DB_URL`, `DB_USER`, `DB_PASSWORD`: PostgreSQL JDBC bağlantısı.
- `REDIS_URL`: Redis URI.
- `JWT_SECRET`: minimum 32 random bayt, Base64.
- `FRONTEND_URL`, `CORS_ORIGINS`: frontend origin və konkret icazəli origin-lər.
- `AI_PROVIDER=groq`, `GROQ_API_KEY`, `GROQ_MODEL=openai/gpt-oss-20b`.
- `PORT`: API portu; default 8080. Management portu 9091.

Spring Boot `.env` fayllarını özü oxumur; IntelliJ və ayrıca deploy-da dəyişənləri prosesə ötürün.

## API

`POST /api/v1/auth/login` sorğusu:

```json
{"email":"elgun@gmail.com","password":"12345678"}
```

Cavabda access və refresh token gəlir. `GET /api/v1/auth/me` üçün `Authorization: Bearer <accessToken>` göndərin. Refresh rotasiyası, logout, logout-all və rate limit saxlanılıb. Frontend tokenləri yalnız yaddaşda saxlayır.

[API kataloqu](docs/API.md) · [Arxitektura](docs/ARCHITECTURE.md) · [AI](docs/AI-INTEGRATION.md) · [Status](STATUS.md)

Ayrı deploy üçün `compose.prod.yml` və `.env.production.example` istifadə olunur. Migration və runtime DB rolları ayrı olmalıdır. Tam platformanın lab, RAG, assessment, billing və report hissələri hələ tamamlanmayıb.
