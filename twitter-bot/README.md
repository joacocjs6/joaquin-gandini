# Twitter / X bot: una publicación al día

Bot en Node.js que publica **una vez al día** en X (Twitter) tomando el siguiente texto de una cola (`posts.json`). Corre gratis con GitHub Actions; no necesitás un servidor.

## Cómo funciona

1. GitHub Actions ejecuta el bot todos los días a las **08:47 (hora de Montevideo)**.
2. El bot toma la primera publicación de `posts.json` que todavía no figura en `state.json`.
3. La publica con la API v2 de X y anota en `state.json` qué publicó y en qué fecha.
4. El workflow commitea `state.json` de vuelta al repo, así mañana sigue con la próxima.

Protecciones:
- **No publica dos veces el mismo día**, aunque relances el workflow (salvo con `force`).
- Valida `posts.json` antes de publicar: ids únicos, texto no vacío, máximo 280 caracteres (las URLs cuentan 23, igual que en X).
- Cuando se termina la cola, **vuelve a empezar** desde el principio. Para que en ese caso se detenga, poné `LOOP=false`.

## Configuración (una sola vez)

### 1. Credenciales de X

1. Entrá a <https://developer.x.com> con la cuenta que va a publicar y creá un proyecto y una app (el plan Free alcanza para publicar).
2. En la app, en **User authentication settings**, configurá los permisos en **Read and write**.
3. En **Keys and tokens** generá:
   - API Key y API Key Secret
   - Access Token y Access Token Secret. Generalos **después** de activar *Read and write*; si no, el token queda de solo lectura.

### 2. Secrets en GitHub

En el repo: **Settings → Secrets and variables → Actions → New repository secret**, y creá estos cuatro:

| Secret            | Valor                |
|-------------------|----------------------|
| `X_API_KEY`       | API Key              |
| `X_API_SECRET`    | API Key Secret       |
| `X_ACCESS_TOKEN`  | Access Token         |
| `X_ACCESS_SECRET` | Access Token Secret  |

### 3. Activar el workflow

El workflow está en `.github/workflows/twitter-bot.yml`. GitHub ejecuta los workflows programados (`schedule`) **solo desde la rama por defecto** (`main`), así que tiene que estar mergeado ahí.

Para probarlo sin esperar al día siguiente: **Actions → Twitter bot - publicación diaria → Run workflow**. Marcá `dry_run` para ver qué publicaría sin publicar nada.

## Agregar contenido

Editá `posts.json`. Cada entrada necesita un `id` único y un `text`:

```json
{ "id": "011-mi-post", "text": "Texto de la publicación #hashtag" }
```

Se publican en el orden del archivo. Podés agregar al final en cualquier momento; lo ya publicado no se repite (hasta que se termine el ciclo).

## Uso local

```bash
cd twitter-bot
npm install
npm test            # tests + valida posts.json
npm run dry-run     # muestra la próxima publicación sin publicar

# Publicar de verdad desde tu máquina:
X_API_KEY=... X_API_SECRET=... X_ACCESS_TOKEN=... X_ACCESS_SECRET=... npm run post
```

## Variables de entorno

| Variable   | Por defecto          | Para qué sirve                                   |
|------------|----------------------|--------------------------------------------------|
| `DRY_RUN`  | `false`              | `true`: muestra la publicación pero no la envía. |
| `FORCE`    | `false`              | `true`: publica aunque ya se haya publicado hoy. |
| `LOOP`     | `true`               | `false`: se detiene al terminar la cola.         |
| `TIMEZONE` | `America/Montevideo` | Zona horaria que define qué es "hoy".            |

## Cambiar el horario

Editá la línea `cron` en `.github/workflows/twitter-bot.yml`. Está en **UTC**; Montevideo es UTC-3. Por ejemplo, `'0 21 * * *'` publica a las 18:00 de Montevideo. GitHub puede demorar unos minutos en arrancar los workflows programados.
