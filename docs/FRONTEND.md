# Frontend inteqrasiyası

## Real Java API-yə bağlı səhifələr

| Route | Funksiya |
|---|---|
| `/auth` | Login, qeydiyyat və avtomatik login; təsdiq kodu yoxdur; şifrə bərpası |
| `/reset-password#token=…` | E-poçtdakı bərpa keçidi; fragment dərhal ünvan sətrindən silinir |
| `/accept-invitation#token=…` | Dəvət tokeni yaddaşda qalır, lazım olduqda həmin ekranda login |
| `/ai` | Təşkilat/kurs/tapşırıq seçimi ilə AI köməkçisi |
| `/account` | Profil, şifrə dəyişmə, bütün sessiyaları bitirmə |
| `/organizations` | Öz təşkilatları və təşkilat yaratma |
| `/organizations/:orgId` | Rol, qruplar, admin üçün üzvlər/dəvətlər/ad dəyişmə |
| `/organizations/:orgId/groups/:groupId` | Roster, tələbə/müəllim təyinatları və qrupun adı |
| `/organizations/:orgId/courses` | Rol əsasında kurs kataloqu və kurs yaratma |
| `/organizations/:orgId/courses/:courseId` | Məzmun redaktoru, yayımlama, qrup təyinatı və AI yardım |

## Sessiya və məlumat axını

`src/lib/api/client.ts` vahid HTTP adapteridir. RFC7807 səhvlərini və Retry-After göstərir, cookies göndərmir. Paralel 401 cavablarında refresh yalnız bir dəfə rotasiya edilir. 403/409/429/5xx və qeyri-müəyyən şəbəkə xətalarında mutasiyalar təkrarlanmır. Sessiya dəyişdikdən sonra köhnə sorğunun nəticəsi yeni istifadəçiyə təqdim edilmir. Logout React Query cache-ni təmizləyir. Logout serverdə təsdiqlənməyibsə, istifadəçiyə bildirilir.

Frontend icazə yoxlaması görünüş üçündür; əsas icazə backend-dədir. Üzv siyahısında UUID göstərilir: backend başqa istifadəçinin e-poçtunu hazırda paylaşmır. Pagination, loading, boş siyahı, xəta və disabled mutation vəziyyətləri mövcuddur.

Kurs redaktoru bütöv qaralama məzmununu `PUT` edir. Backend-dən gələn ID və position-lar `courseUpdate` ilə request-dən çıxarılır. Yayımlanmış kurs redaktə edilmir. Optimistic `version` toqquşması HTTP 409 qaytarır və yazılmamış mətn saxlanılır. Kurs sorğusu mövcud 16 KiB API həddinə tabedir.

## Məhdudiyyətlər

- Səhifə yenilənməsi sessiyanı bitirir; localStorage-da credential saxlanmır.
- Kurs arxivləmə və draft silmə backend API-də var; frontend hazırda yaradılma/redaktə/yayım/təyinat axınını əhatə edir.
- Lab başlatma, real cəhd və mastery hələ kurs səhifəsinə bağlı deyil.
- Köhnə Arena/CTF/icma/liderlik səhifələri real yeni backend-dən məlumat almır.
- Davamlı brauzer sessiyası, frontend E2E avtomatlaşdırması və production reverse proxy ayrıca işdir.

## Mövcud yoxlama əmrləri

`npm run typecheck`, `npm run build`, `npm run test:frontend`.

`test:frontend` credential saxlanması deyil, HTTP adapter davranışını yoxlayan 10 Node unit testidir. Bu suite istifadəçinin yoxlamaları dayandırmaq göstərişindən ƏVVƏL keçib; AI və təsdiqsiz qeydiyyatın test sübutu deyil. Sonrakı işdə yalnız compile/build istifadə olunub.
