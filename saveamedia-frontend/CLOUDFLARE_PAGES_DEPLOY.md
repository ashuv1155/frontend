# Cloudflare Pages Deployment Guide — SaveAMedia Frontend

This frontend is production-ready for Cloudflare Pages with complete SEO, AEO (Generative Engine Optimization), Edge API routes, and responsive UI.

---

## 1. Quick Deploy via Cloudflare Dashboard

1. Push this frontend repository to your GitHub account (e.g. `saveamedia-frontend`).
   * **Crucial:** Ensure `package.json` is at the **root** of your repository (not nested inside a subfolder).
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
3. Select your `saveamedia-frontend` repository.
4. In the **Set up builds and deployments** screen, enter:

| Setting | Value |
| :--- | :--- |
| **Project name** | `saveamedia` |
| **Production branch** | `main` (or `master`) |
| **Framework preset** | `Next.js` |
| **Build command** | `npx @cloudflare/next-on-pages` *(or `npm run build`)* |
| **Build output directory** | `.vercel/output/static` *(or `.next`)* |
| **Root directory** | `/` (leave empty or set to root) |

5. Under **Environment variables (Production & Preview)**, add:

| Variable Name | Value | Purpose |
| :--- | :--- | :--- |
| `NODE_VERSION` | `20.18.0` | Ensures Node 20 runtime during build |
| `NEXT_PUBLIC_SITE_URL` | `https://saveamedia.com` | Sets canonical URLs and Open Graph tags |
| `NEXT_PUBLIC_API_BASE_URL` | `https://saveamedia-backend.onrender.com` | Connects extraction requests to Render backend |
| `BACKEND_GATEWAY_URL` | `https://saveamedia-backend.onrender.com` | Server-side gateway upstream fallback |

6. Under **Settings** → **Functions** → **Compatibility flags**:
   * Add `nodejs_compat` to both **Production** and **Preview**.

7. Click **Save and Deploy**.

---

## 2. Features Included in this Frontend Deliverable

1. **Massive Programmatic SEO (25 Static Pages):**
   * Multi-entity JSON-LD schema graph (`WebApplication`, `FAQPage`, `HowTo`, `BreadcrumbList`).
   * Dynamic automated `sitemap.xml` and `robots.txt`.
   * High-intent keyword landing pages targeting 1080p, PC, Mac, iPhone, Android, camera roll saving, and clean audio extraction.
2. **Generative Engine (GEO) & Answer Engine (AEO) Optimization:**
   * `/llms.txt` and `/llms-full.txt` structured specifically for AI answer engines (ChatGPT Search, Perplexity, Claude, Gemini, Grok).
3. **Clean Public Consumer Interface:**
   * Zero source code download buttons, zip badges, or developer testing widgets.
   * Public directory contains only brand assets (`favicon`, `og-image`, `llms.txt`, `ads.txt`).
4. **Resilient Dual Extraction Routing:**
   * Native `/api/v1/extract` Edge Route runs globally on Cloudflare Edge.
   * Connects to your Render backend (`saveamedia-backend.onrender.com`) with instant native fallback.
5. **Native 1-Click Video Downloader (`/api/v1/download`):**
   * Forces clean `.mp4` attachment download with creator and shortcode filenames.
   * Eliminates cross-origin CORS download blocks on mobile Safari and Chrome.
