# HackTrain — cari icra statusu

## Son istifadəçi göstərişi

Pentest və yoxlamalar dayandırılıb. E-poçt təsdiq məktubu/kodu tələbi çıxarılıb. AI inteqrasiyası və frontend işi davam etdirilib. Son dəyişikliklərdən sonra test suite işə salınmayıb; compile/build nəticəsi test nəticəsi kimi təqdim edilmir.

## Hazır kod

- `auth`: e-poçt/şifrə qeydiyyatı və birbaşa giriş; JWT/refresh, logout, şifrə dəyişmə/bərpa. Normal profildə e-poçt təsdiqi yoxdur. `emailVerified` avtomatik true edilmir. Əvvəlki verification endpoint-ləri aktiv axından çıxarılıb. Test profilində köhnə verification müqaviləsi ayrıca saxlanır.
- `organization`: təşkilat, tenant scope/RLS, üzvlər, qruplar, müəllim/tələbə təyinatları, e-poçt dəvətləri; frontend üçün öz membership endpoint-i.
- `course`: V3 Flyway, Course/Topic/Task/LearningObjective/CourseGroup/CourseEvent; MapStruct, DTO, validation, API. Qaralama redaktə/silmə, tamlıq yoxlaması ilə publish, archive, qrup təyinatı. Yayımlanmış məzmun dəyişməzdir. Tələbə yalnız aktiv qrupuna təyin olunmuş yayımlanmış kursları görür.
- `ai`: OpenAI Responses adapteri, backend-only kontekst, schema validator, səviyyə 1, Redis limitləri, circuit breaker, timeout, token/latency logları və işarələnmiş static fallback. Real API açarı yoxdur.
- React frontend: auth, account, organization, group, invitation, course editor/catalog/detail və tapşırıq daxilində AI köməkçisi. API tokenləri yalnız yaddaşdadır.
- Compose backend stack, migration job, CI konfiqurasiyası, Prometheus/Grafana auth/organization infrastrukturu əvvəlki işdən qalır.

## Yoxlama nəticələrinin sərhədi

Auth+organization əvvəlki vəziyyətdə 76 test/89.71% coverage ilə yoxlanmışdı. Course və membership əlavə olunduqdan sonra, son dayandırma göstərişindən ƏVVƏL Maven clean verify keçib. Frontend HTTP adapterinin 10 unit testi həmin vaxt keçib. AI, e-poçt təsdiqinin çıxarılması və son konfiqurasiya dəyişiklikləri bu tarixi nəticələrə daxil deyil.

Lokal Docker image yenilənib; V3 migrasiya job-u tamamlanıb və app container healthy vəziyyətdədir. Backend konfiqurasiyası git-dən kənar, 0600 icazəli `backend/.env` faylında saxlanır. Canlı AI açarı boşdur.

Son dəyişikliklər üçün `npm run typecheck`, `npm run build` və `mvn -Dmaven.test.skip=true package` uğurlu olub. AI eval, pentest, yük testi və canlı model çağırışı aparılmayıb. Bütöv platforma üçün production hazırlığı təsdiqlənməyib.

## Davam nöqtəsi

Əvvəl AI üçün `OPENAI_API_KEY` və `OPENAI_MODEL` backend environment-də konfiqurasiya edilməlidir. Secret-lər frontend-ə və ya çata yazılmamalıdır.

Qalan modullar: lab → attempt → assessment → report → gamification → billing → notification → audit → admin. AI üzrə qalanlar: Claude/Gemini və provider fallback, pgvector RAG, real attempt sübutları, səviyyə 2/3 icazə siyasəti, prompt DB/A-B, DB usage/xərc/cache, SSE, 20×3 eval. GDPR/pilot, 500 istifadəçi yük testi və production deploy tamamlanmayıb.

V1/V2/V3 migrasiyalarını növbəti işdə redaktə etməyin. Yeni DB dəyişiklikləri V4-dən başlamalıdır.

Ətraflı [AI inteqrasiyası](docs/AI-INTEGRATION.md), [frontend](../docs/FRONTEND.md), [API](docs/API.md). Tarixi sübutlar `docs/evidence/`-də saxlanılır.
