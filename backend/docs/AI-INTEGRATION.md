# AI inteqrasiyası — mövcud implementasiya

## Axın

```mermaid
sequenceDiagram
  participant UI as Tapşırıq səhifəsi
  participant API as AiController
  participant Course as CourseService
  participant Redis as Redis kvotası
  participant Provider as OpenAI Responses
  UI->>API: taskId + tələbənin izahı (Bearer)
  API->>Course: Kursa giriş və yayımlanma yoxlaması
  Course-->>API: Yalnız məqsədlər və tapşırıq ID-si
  API->>Redis: Tələbə/təşkilat limitindən istifadə
  API->>Provider: Ayrı system prompt + untrustedLearningData + JSON Schema
  Provider-->>API: Strukturlaşdırılmış JSON + usage
  API->>API: Schema, səviyyə, sübut və çıxış yoxlaması
  API-->>UI: AI cavabı və ya fallback=true sabit sual
```

`ai` ayrıca Maven moduludur. Provider portu `AiProvider`, hazır adapter `OpenAiProvider`-dir. Hazırda yalnız OpenAI implementasiya olunub; Claude/Gemini adapterləri gələcək işdir. Model environment-dən seçilir, brauzerdən seçilmir.

## Hazır endpoint-lər

- `GET /api/v1/ai/status`: authenticated; configured/provider/model/allowedHintLevel/mode.
- `POST /api/v1/organizations/{org}/courses/{course}/tasks/{task}/ai/hint`: authenticated; `{ "explanation": "…" }`.

Cavab `{requestId,hint,fallback,source,provider,model,promptVersion,message}`; hint `difficulty,evidenceAttemptIds,needsClarification,clarifyingQuestion,hintLevel,hintText,confidence` sahələridir.

## Kontekst və hədlər

Backend yalnız task ID, yayımlanmış kursun öyrənmə məqsədləri, tələbə izahı və icazə verilən səviyyəni göndərir. Tam entity, task instructions, email, JWT, refresh token və secret konfiqurasiyası model kontekstinə daxil edilmir. Hazırkı rejim **kurs müəllimi köməkçisidir**, real laboratoriya cəhdi diaqnozu deyil. Ona görə `recentAttempts`, `approvedExplanations`, `evidenceAttemptIds` boşdur və `hintLevel` həmişə backend tərəfindən 1-dir. Uydurulmuş attempt ID-ləri rədd edilir.

Öyrənmə məqsədləri RAG sayılmır. pgvector və müəllim tərəfindən təsdiqlənmiş izah bazası hələ qoşulmayıb. Lab uğuru və mastery AI cavabından hesablanmır.

Prompt və schema `ai/src/main/resources/ai/` içində ayrıca versiyalı fayllardır. NetworkNT JSON Schema validator çıxışı yoxlayır. Clarification/null uyğunluğu, sübutların boşluğu və səviyyə ayrıca yoxlanır. Sadə flag/token nümunələri və konfiqurasiya secret-lərinin təkrarı rədd edilir; bu tam sızma təminatı və ya AI eval sübutu deyil. Çıxış React mətnidir, kod/HTML icra edilmir.

## Davamlılıq və usage

- Provider hostu sabit `https://api.openai.com/v1/responses`; redirect yoxdur, istifadəçi target URL seçmir.
- `store:false`, 1200 output token həddi, 5 saniyə connect timeout, 25 saniyə request timeout.
- Resilience4j circuit breaker; instansiyada maksimum 12 paralel çağırış.
- Schema xətasında bir əlavə cəhd. Şəbəkə/provider xətasında birbaşa sabit fallback.
- Bucket4j/Redis: tələbəyə 5 sorğu/dəqiqə, default 30/24 saat; təşkilata default 1000/24 saat. Interval ilk bucket yaradılmasından başlayır, UTC təqvim günü deyil. İki bucket konservativ ardıcıllıqla xərclənir; təşkilat rədd etdikdə istifadəçinin bir slotu istifadə olunmuş qala bilər. Hər istifadəçi sorğusu maksimum iki provider çağırışı yarada bilər.
- Token sayları, model, provider, prompt versiyası, latency və request ID loglanır. İzah/prompt/raw cavab/key loglanmır.
- Dəqiq pul xərci, DB usage ledger, semantik cache, provider fallback, prompt DB/A-B və SSE hələ implementasiya edilməyib. İndiki cavab adi JSON-dur; frontend gözləmə vəziyyətini göstərir.

## Konfiqurasiya

`OPENAI_API_KEY`, `OPENAI_MODEL`, `AI_STUDENT_DAILY_LIMIT`, `AI_ORGANIZATION_DAILY_LIMIT` yalnız backend-də saxlanır. İlk ikisi boş olanda `configured=false` və `fallback=true` qaytarılır; bu AI cavabı kimi təqdim olunmur.

Cari environment-də API açarı yoxdur. Real model çağırışı və keyfiyyət qiymətləndirilməsi icra edilməyib. İstifadəçi pentest/yoxlamanı dayandırdıqdan sonra yalnız compile/build aparılıb.

API müqaviləsi üçün rəsmi mənbə: [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses).
