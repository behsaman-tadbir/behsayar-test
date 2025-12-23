# mehr-soleyman-mvp

## Local development

1. Install dependencies with `npm install`.
2. Run `npm run dev` and open `http://localhost:3000/mehr-soleyman-mvp/` (the app uses the repository name as `basePath`).

## Deployment (GitHub Pages)

- A GitHub Actions workflow (`.github/workflows/pages.yml`) builds the app with `npm run deploy:pages` and uploads the static `out/` directory for Pages.
- The app is statically exported (`output: "export"`) with `basePath`/`assetPrefix` set to the repository name so it serves from `https://<username>.github.io/mehr-soleyman-mvp/`.

## Base path note

Assets and links use relative paths so they work under the `basePath`. Avoid leading `/` in new links or asset references to keep GitHub Pages paths valid.
