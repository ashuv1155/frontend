# Cloudflare Pages Deployment Guide — SaveAMedia

This guide resolves the Cloudflare build error:
`✘ [ERROR] Could not detect a directory containing static files for the project`

---

## 1. Why Did that Error Happen?

In your Cloudflare dashboard screenshot, two things caused this error:
1. **You created a Cloudflare Worker instead of Cloudflare Pages:**  
   Notice the breadcrumb and URL in your screenshot:  
   `Workers & Pages > saveamedia (Workers)`  
   `dash.cloudflare.com/.../workers/services/view/saveamedia/...`  
   Cloudflare has two products: **Workers** (for single backend API functions) and **Pages** (for Next.js, React, and frontend web apps).
2. **Build command was set to `None`:**  
   Cloudflare attempted to run `npx wrangler deploy` directly without building your Next.js application first (`Build command: None`). Because nothing was compiled, Wrangler could not find any static files directory.

---

## 2. The Official & Easiest Fix: Deploy as Cloudflare Pages (Recommended)

Next.js 14 is officially supported on **Cloudflare Pages**. Follow these simple steps:

### Step 1: Push the Updated Clean Files to GitHub
Ensure you use the updated `saveamedia-frontend.zip` (we removed the conflicting `wrangler.toml` file that was tricking Cloudflare into Worker mode).

Push the files to your GitHub repository `ashuv1155/frontend`:
```bash
git add .
git commit -m "Fix Cloudflare Pages configuration: remove conflicting wrangler.toml"
git push origin main
```

---

### Step 2: Create a Cloudflare Pages Project

1. Go to your **[Cloudflare Dashboard](https://dash.cloudflare.com/)**.
2. In the left sidebar under **Compute**, click **Workers & Pages**.
3. Under the **Overview** section, click the blue **Create application** button.
4. **CRITICAL STEP:** At the top of the screen, you will see two tabs:
   * `Workers`
   * `Pages`  <--- **CLICK "PAGES" (NOT WORKERS)**
5. Click **Connect to Git**.
6. Select your repository: `ashuv1155/frontend` and click **Begin setup**.

---

### Step 3: Enter Build Settings

In the **Set up builds and deployments** screen:

| Setting | Value | Notes |
| :--- | :--- | :--- |
| **Project name** | `saveamedia-app` (or any name) | Will generate `saveamedia-app.pages.dev` |
| **Production branch** | `main` | Default branch |
| **Framework preset** | `Next.js` | Cloudflare auto-configures Next.js |
| **Build command** | `npx @cloudflare/next-on-pages` | Standard Cloudflare Pages build command |
| **Build output directory** | `.vercel/output/static` | Where Pages reads all static HTML & edge routes |
| **Root directory** | `/` | Leave empty or set to root `/` |

---

### Step 4: Environment Variables & Compatibility Flags

#### A. Environment Variables:
Under **Environment variables (Production & Preview)**, add:

| Variable Name | Value |
| :--- | :--- |
| `NODE_VERSION` | `20.18.0` |
| `NEXT_PUBLIC_SITE_URL` | `https://saveamedia.com` |
| `NEXT_PUBLIC_API_BASE_URL` | `https://saveamedia-backend.onrender.com` |
| `BACKEND_GATEWAY_URL` | `https://saveamedia-backend.onrender.com` |

#### B. Compatibility Flags:
After the project is created (or in Settings):
1. Go to **Settings** → **Functions** → **Compatibility flags**.
2. Add `nodejs_compat` to both **Production** and **Preview**.

Click **Save and Deploy**. Your site will build and deploy globally in under 60 seconds!

---

## 3. Alternative: How to Fix Your Existing Worker Project (`saveamedia`)

If you want to keep the exact Worker project shown in your screenshot without creating a Pages project:

1. In your Cloudflare dashboard on the `saveamedia` project, click the **Settings** tab (top right tab).
2. Go to **Builds & deployments** → **Build configuration**.
3. Change **Build command** from `None` to:
   ```bash
   npm run build
   ```
4. Set **Build output directory** to:
   ```bash
   .next
   ```
5. Save changes and click **Retry deployment**.
