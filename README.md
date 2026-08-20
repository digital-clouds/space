# Space

Monorepo for Cloudflare Workers routing, Google Cloud Storage (GCS) deployments, Fleek IPFS storage, and Cloudflare R2 assets.

## Overview

- **Cloudflare Workers** (`workers/*`):
  - `digital-space`: Edge worker caching and routing for `space.digitalclouds.dev` backed by GCS bucket `digital-space`.
  - `gcp-space`: Edge worker caching and routing for `storage.w-ss.io` backed by GCS bucket `gcp-space`.
  - `ipfs-space`: Edge worker caching and routing backed by Fleek IPFS bucket (`ss-o-team-bucket`).
- **GCS Assets** (`gcs/*`): Assets synchronized to Google Cloud Storage via [GCP Action](.github/workflows/gcp-action.yml).
- **R2 Assets** (`r2/*`): Assets synchronized to Cloudflare R2 via [Rclone Action](.github/workflows/rclone-action.yml).
- **IPFS Assets** (`ipfs/*`): IPFS data assets.

## Development

### Prerequisites

- Node.js >= 22
- pnpm >= 10

### Setup

```bash
# Install all monorepo dependencies
pnpm install
```

### Scripts

- `pnpm run typecheck`: Type check all TypeScript workspaces
- `pnpm run test`: Run unit test suites with Vitest across all workers
- `pnpm run lint`: Lint with ESLint (flat config)
- `pnpm run fmt`: Format code with Trunk / Prettier
- `pnpm run check`: Run Trunk checks across the repository

### Deployments & Development

- `pnpm run dev:digital-space`: Run local dev server for `digital-space`
- `pnpm run dev:gcp-space`: Run local dev server for `gcp-space`
- `pnpm run dev:ipfs-space`: Run local dev server for `ipfs-space`
- `pnpm run deploy:digital-space`: Deploy `digital-space` worker with Wrangler
- `pnpm run deploy:gcp-space`: Deploy `gcp-space` worker with Wrangler
- `pnpm run deploy:ipfs-space`: Deploy `ipfs-space` worker with Wrangler

## CI / CD & Automation

- [CI Workflow](.github/workflows/ci.yml): Runs type checks, tests, and linter validation on every push and pull request.
- [Wrangler Action](.github/workflows/wrangler-action.yml): Deploys Cloudflare Workers on pushes to `main`.
- [GCP Action](.github/workflows/gcp-action.yml): Uploads assets to Google Cloud Storage buckets.
- [Rclone Action](.github/workflows/rclone-action.yml): Synchronizes R2 assets.
- [Dependabot](.github/dependabot.yml): Daily automated dependency updates across all package ecosystems (GitHub Actions, root workspace, and worker packages) with grouped PRs and semantic commit conventions.

## License

[GPL-3.0](LICENSE)
