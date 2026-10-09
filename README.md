# HackTrain

**Ayrı deploy:** frontend və backend üçün [DEPLOY təlimatı](docs/DEPLOY.md). `npm run export:deploy` ayrı mənbə paketləri yaradır. Frontend API ünvanı `VITE_API_BASE_URL` ilə seçilir.

React/TypeScript frontend + Java 21/Spring Boot modular backend.

## Hazır axınlar

- Sabit giriş: `elgun@gmail.com` / `12345678`. Qeydiyyat, e-poçt təsdiqi və şifrə bərpası çıxarılıb. SMTP/poçt servisi yoxdur. Parol BCrypt ilə saxlanır.
- Təşkilatlar, öz təşkilat rolunun oxunması, qruplar, üzvlər, müəllim/tələbə təyinatı, dəvətlər.
- Kurs, mövzu, tapşırıq, çətinlik və öyrənmə məqsədi redaktoru; yayımlama; qruplara kurs təyinatı; tələbə görünüşü.
- Yayımlanmış tapşırıqda AI təlim köməkçisi. Groq, Claude Messages və OpenAI Responses API adapterləri, server tərəfində JSON Schema yoxlaması, səviyyə 1 ipucu, Redis limitləri, timeout, circuit breaker və açıq işarələnmiş sabit fallback.

AI açarı/modeli verilməyibsə, sistem real AI cavabı hazırladığını iddia etmir. Laboratoriya runner-i, cəhd sübutları, RAG, assessment, billing və hesabat modulları tamamlanmayıb. Köhnə Arena/CTF/icma səhifələri əvvəlki prototipə aiddir və yeni backend nəticələrinin sübutu sayılmır. Köhnə uzaq API-yə bağlı admin route-ları aktiv routing-dən çıxarılıb.

## Lokal işə salma

1. `backend/.env` artıq varsa, onu saxlayın. Yoxdursa `backend/.env.example` əsasında yaradın. PostgreSQL, runtime DB, Redis və Grafana şifrələrini doldurun. `JWT_SECRET` üçün `openssl rand -base64 32` nəticələrindən istifadə edin.
2. Backend: `docker compose --env-file backend/.env -f backend/compose.yml up -d --build`.
3. Frontend: `npm ci`, sonra `npm run dev`.
4. Frontend `http://localhost:8080`, API `http://localhost:8081`.

Hazırkı lokal `backend/.env` mövcud stack-i `COMPOSE_PROJECT_NAME` vasitəsilə seçir; bu dəyişəni dəyişmək ayrıca stack yaradacaq.

Vite `/api` sorğularını `127.0.0.1:8081`-ə yönləndirir. Ayrı frontend deploy-da `VITE_API_BASE_URL` backend ünvanına qurulur. `vite preview` API reverse proxy-ni təmin etmir. Dəvət yaradılarkən paylaşmaq üçün link qaytarılır; məktub göndərilmir.

## Groq AI inteqrasiyası

Aktiv provider `groq`, model `openai/gpt-oss-20b`-dir. Açar yalnız Git-dən kənar `backend/.env.groq.local` faylındadır (0600).

```sh
docker compose --env-file backend/.env --env-file backend/.env.groq.local -f backend/compose.yml up -d --build app
```

Frontend: `http://localhost:8080/ai`. Təşkilat → yayımlanmış kurs → tapşırıq seçin və izahınızı göndərin. Köməkçi kurs tapşırıqlarının daxilində də mövcuddur.

Yeni Java adapteri ilə real Groq cavabı alınıb və backend JSON Schema/səviyyə yoxlamasından keçib. Pentest və test suite işlədilməyib.

Konfiqurasiya: `AI_PROVIDER=groq`, `GROQ_API_KEY`, `GROQ_MODEL=openai/gpt-oss-20b`. Açar frontend-ə və `VITE_` dəyişənlərinə yazılmır. Claude və OpenAI adapterləri alternativ kimi qalır, avtomatik provider keçidi yoxdur. Xidmət xətasında sabit fallback açıq işarələnir.

## Sessiyalar

Access və refresh token-lər yalnız JavaScript yaddaşında saxlanılır. Səhifəni yenilədikdə təkrar giriş lazımdır. Davamlı brauzer sessiyası üçün ayrıca HttpOnly cookie/BFF və CSRF axını gələcək işdir.

## Yoxlama vəziyyəti

Son istifadəçi göstərişi ilə pentest və davam edən yoxlamalar dayandırılıb. Bundan sonrakı AI və təsdiqsiz qeydiyyat dəyişiklikləri üçün frontend TypeScript/build və backend compile/package icra edilib; yeni test suite və canlı AI çağırışı icra edilməyib. Əvvəlki test nəticələri yalnız əvvəlki kod vəziyyətinə aiddir.

Ətraflı: [frontend](docs/FRONTEND.md), [AI inteqrasiyası](backend/docs/AI-INTEGRATION.md), [backend statusu](backend/STATUS.md), [API](backend/docs/API.md).

## IntelliJ environment

IntelliJ-dən başladılan Java prosesi Compose-un environment dəyişənlərini avtomatik almır. Run → Edit Configurations → Environment variables bölməsində `DB_URL`, `DB_USER`, `DB_PASSWORD`, `REDIS_URL`, `JWT_SECRET`, `FRONTEND_URL`, `CORS_ORIGINS` verilməlidir. Groq üçün `AI_PROVIDER=groq`, `GROQ_API_KEY`, `GROQ_MODEL` də həmin prosesə ötürülməlidir. `.env` faylları standart Spring Boot tərəfindən avtomatik oxunmur. Secret-ləri Git-ə daxil edilən run configuration-da saxlamayın.
