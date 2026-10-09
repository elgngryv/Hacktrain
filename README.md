# HackTrain

React/TypeScript frontend + Java 21/Spring Boot modular backend.

## Hazır axınlar

- E-poçt və şifrə ilə qeydiyyat və giriş. **E-poçt təsdiqi və təsdiq kodu tələb olunmur.** Qeydiyyatdan sonra frontend avtomatik daxil olur.
- Təşkilatlar, öz təşkilat rolunun oxunması, qruplar, üzvlər, müəllim/tələbə təyinatı, dəvətlər.
- Kurs, mövzu, tapşırıq, çətinlik və öyrənmə məqsədi redaktoru; yayımlama; qruplara kurs təyinatı; tələbə görünüşü.
- Yayımlanmış tapşırıqda AI təlim köməkçisi. Groq, Claude Messages və OpenAI Responses API adapterləri, server tərəfində JSON Schema yoxlaması, səviyyə 1 ipucu, Redis limitləri, timeout, circuit breaker və açıq işarələnmiş sabit fallback.

AI açarı/modeli verilməyibsə, sistem real AI cavabı hazırladığını iddia etmir. Laboratoriya runner-i, cəhd sübutları, RAG, assessment, billing və hesabat modulları tamamlanmayıb. Köhnə Arena/CTF/icma səhifələri əvvəlki prototipə aiddir və yeni backend nəticələrinin sübutu sayılmır. Köhnə uzaq API-yə bağlı admin route-ları aktiv routing-dən çıxarılıb.

## Lokal işə salma

1. `backend/.env` artıq varsa, onu saxlayın. Yoxdursa `backend/.env.example` əsasında yaradın. PostgreSQL, runtime DB, Redis və Grafana şifrələrini doldurun. `JWT_SECRET` və `MAIL_ENCRYPTION_KEY` üçün ayrı-ayrı `openssl rand -base64 32` nəticələrindən istifadə edin.
2. Backend: `docker compose --env-file backend/.env -f backend/compose.yml up -d --build`.
3. Frontend: `npm ci`, sonra `npm run dev`.
4. Frontend `http://localhost:8080`, API `http://localhost:8081`.

Hazırkı lokal `backend/.env` mövcud stack-i `COMPOSE_PROJECT_NAME` vasitəsilə seçir; bu dəyişəni dəyişmək ayrıca stack yaradacaq.

Vite `/api` sorğularını `127.0.0.1:8081`-ə yönləndirir. Production-da static frontend və `/api` üçün eyni origin üzərindən reverse proxy qurulmalıdır. `vite preview` API reverse proxy-ni təmin etmir. Mailpit yalnız şifrə bərpası və təşkilat dəvətlərinin lokal poçtunu tutur; qeydiyyat üçün poçt lazım deyil.

## Groq AI inteqrasiyası

Aktiv provider `groq`, model `openai/gpt-oss-20b`-dir. Açar yalnız Git-dən kənar `backend/.env.groq.local` faylındadır (0600).

```sh
docker compose --env-file backend/.env --env-file backend/.env.groq.local -f backend/compose.yml up -d --build app
```

Frontend: `http://localhost:8080/ai`. Təşkilat → yayımlanmış kurs → tapşırıq seçin və izahınızı göndərin. Köməkçi kurs tapşırıqlarının daxilində də mövcuddur.

Yeni Java adapteri ilə real Groq cavabı alınıb və backend JSON Schema/səviyyə yoxlamasından keçib. Pentest və test suite işlədilməyib.

Konfiqurasiya: `AI_PROVIDER=groq`, `GROQ_API_KEY`, `GROQ_MODEL=openai/gpt-oss-20b`. Açar frontend-ə və `VITE_` dəyişənlərinə yazılmır. Claude və OpenAI adapterləri alternativ kimi qalır, avtomatik provider keçidi yoxdur. Xidmət xətasında sabit fallback açıq işarələnir.

## Sessiyalar

Access və refresh token-lər yalnız JavaScript yaddaşında saxlanılır. Səhifəni yenilədikdə təkrar giriş lazımdır. Davamlı brauzer sessiyası üçün ayrıca HttpOnly cookie/BFF və CSRF axını gələcək işdir. `emailVerified=false` qeydiyyatdan sonra saxlanılır: təsdiq tələbinin çıxarılması ünvanın təsdiqləndiyi mənasına gəlmir. Köhnə təsdiq API-si normal profildə bağlıdır; köhnə təsdiq məktublarının növbədən göndərilməsi dayandırılır.

## Yoxlama vəziyyəti

Son istifadəçi göstərişi ilə pentest və davam edən yoxlamalar dayandırılıb. Bundan sonrakı AI və təsdiqsiz qeydiyyat dəyişiklikləri üçün frontend TypeScript/build və backend compile/package icra edilib; yeni test suite və canlı AI çağırışı icra edilməyib. Əvvəlki test nəticələri yalnız əvvəlki kod vəziyyətinə aiddir.

Ətraflı: [frontend](docs/FRONTEND.md), [AI inteqrasiyası](backend/docs/AI-INTEGRATION.md), [backend statusu](backend/STATUS.md), [API](backend/docs/API.md).
