# Deploy the course website

The course website is a **static site**. It has no server runtime and no build step: deploy the repository root as the web root. Markdown lessons remain the source of truth; the browser fetches and renders them. The site is dark-only, responsive, and stores reading progress in local browser storage.

## Preview locally

From the repository root, start any static HTTP server. Python is one option:

```bash
python -m http.server 8000
```

Open <http://localhost:8000>. Use a web server rather than opening `index.html` directly because lesson files are loaded with `fetch()`.

## GitHub Pages

The repository includes `.github/workflows/deploy-pages.yml` to publish the root when changes reach `main`.

1. Open **Settings → Pages** in the repository.
2. Under **Build and deployment → Source**, select **GitHub Actions**.
3. Push to `main` (or run the workflow manually from the Actions tab).
4. Wait for **Deploy course website** to finish; GitHub displays the published URL in the Pages settings and workflow summary.

The workflow needs the repository’s Pages deployment permissions. If organization policy blocks workflow deployment, enable Pages for Actions or use one of the static-hosting options below.

## Netlify

Import the GitHub repository in Netlify. Choose:

| Setting | Value |
|---|---|
| Base directory | leave blank |
| Build command | leave blank |
| Publish directory | `.` |

`netlify.toml` contains the same static publish configuration. Every deploy can publish directly from the selected branch.

## Vercel

Import the GitHub repository and select **Other** as the framework preset. Leave the build command and output-directory override empty; Vercel serves the repository root as static files. `vercel.json` supplies the corresponding static configuration.

## Cloudflare Pages or another static host

Connect the repository, leave the build command blank, and set the output directory to `.` (the repository root). Ensure the host publishes Markdown files and SVG assets as static resources; the browser requests lesson Markdown at runtime.

## Browser dependencies

Markdown parsing, sanitization, and Mermaid diagram rendering are loaded from pinned jsDelivr URLs in `index.html`. The site itself is served by your host, but those three renderer libraries require the visitor’s browser to reach the CDN. If a CDN is unavailable, lesson navigation still identifies the repository; the content loader reports the failure rather than silently rendering an incomplete lesson.
