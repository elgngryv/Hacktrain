# Ayrı frontend və backend deploy

Frontend və backend bir-birindən asılı olmadan build/deploy edilir. Ayrı serverlər və ya ayrı repolar istifadə oluna bilər. Domenlər nümunədir; öz domenlərinizlə əvəz edin.

## 1. Backend

Backend-in iş qovluğu `backend/`-dir. Frontend faylları tələb olunmur. PostgreSQL və Redis ayrıca əlçatan olmalıdır.

1. `.env.production.example` → `.env.production`; bütün DB/Redis/secret/AI dəyərlərini hosting-in secret manager-ində və ya bu lokal faylda doldurun.
2. `FRONTEND_URL=https://app.your-domain.com` və `CORS_ORIGINS=https://app.your-domain.com` təyin edin.
3. Migration rolu cədvəlləri yaradır; runtime `DB_USER` cədvəl sahibi, superuser və ya BYPASSRLS olmamalıdır. `ops/production-roles.sql` yeni DB-də rolları hazırlayır. Mövcud rollar üçün həmin hüquqları DB administratoru tətbiq etməlidir.
4. Backend qovluğunda:

```sh
docker compose --env-file .env.production -f compose.prod.yml up -d --build
```

Compose əvvəl migration job-u, sonra `prod` profilli app-i başladır. App migration şifrəsini almır. API lokal hostda `127.0.0.1:8081`-ə bağlanır; hosting-in HTTPS reverse proxy-si `https://api.your-domain.com` ünvanını bu porta yönləndirməlidir. Managed platforma xarici container portuna ehtiyac duyursa bind adresini onun şəbəkəsinə uyğun dəyişin. TLS hosting/reverse proxy tərəfindən təmin edilir.

Docker image-i idarə olunan hosting-də ayrıca işlətmək üçün build context **backend**, Dockerfile **Dockerfile** seçin. Migration/pre-deploy əmri `java -jar /app/migrator.jar`-dır; onun DB_USER/DB_PASSWORD dəyərləri migration roluna aid olmalıdır. API prosesinə runtime rolunu verin. `SPRING_PROFILES_ACTIVE=prod` və platformanın `PORT` dəyişəni dəstəklənir.

Management endpoint-ləri 9091 portundadır və public port olaraq açılmır. Sabit hesab `elgun@gmail.com` / `12345678` startup zamanı yaradılır. SMTP yoxdur; dəvətlər link kimi qaytarılır. PostgreSQL `verify-full` TLS istifadə etdikdə provider-in tələb etdiyi CA sertifikatını runtime və migration konteynerlərinə təqdim edin.

## 2. Frontend

Frontend package-in root-u işlənən React qovluğudur. Backend/Maven/Java lazım deyil.

Hosting build environment:

```dotenv
VITE_API_BASE_URL=https://api.your-domain.com/api/v1
```

```sh
npm ci
npm run build
```

Publish qovluğu **dist**. Vercel/Netlify üçün mövcud SPA rewrite konfiqurasiyaları paketdədir. Digər static hostlarda `/ai`, `/auth`, `/organizations/...` üçün `index.html` fallback verin. **VITE dəyişəni build zamanı tətbiq edilir**; backend domeni dəyişdikdə frontend-i yenidən build edin. Brauzerə API açarı, JWT secret, DB/Redis şifrəsi verilməməlidir.

Docker variantı frontend root-da:

```sh
docker build -f deploy/frontend/Dockerfile --build-arg VITE_API_BASE_URL=https://api.your-domain.com/api/v1 -t hacktrain-frontend .
docker run --rm --read-only --tmpfs /tmp --cap-drop ALL --security-opt no-new-privileges -p 127.0.0.1:8082:8080 hacktrain-frontend
```

Bu frontend container Java, DB və Redis işə salmır. HTTPS-ni hosting təmin edir. `/healthz` static server health endpoint-idir. `/api` frontend serverdə proxy edilmir; VITE_API_BASE_URL birbaşa backend-ə işarə etməlidir.

## 3. İki ayrıca mənbə paketi

Orijinal monorepo root-da `npm run export:deploy` icra edin. `deployments/<vaxt>/frontend` və `deployments/<vaxt>/backend` bir-birindən müstəqil qovluqlardır; hər birini ayrı repoya və ya hosting layihəsinə köçürmək olar. Export `.env`/açarları, Git tarixçəsini, node_modules və target build qovluqlarını daxil etmir. Secret-ləri yeni hosting-də ayrıca daxil edin.

Lokal əvvəlki iş axını dəyişmir: VITE_API_BASE_URL verilmədikdə `/api/v1` və Vite localhost proxy istifadə olunur. Lokal stack üçün `backend/compose.yml`, ayrıca prod backend üçün `backend/compose.prod.yml` istifadə edin.

Bu dəyişiklik deploy hazırlığıdır; xarici hostda deployment, DNS və sertifikat qurulmayıb. Pentest/test suite işlədilməyib.
