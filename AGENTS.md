# Space Monorepo - Agent Guidelines

## Repository Structure

- `workers/` - Cloudflare Workers (`digital-space`, `gcp-space`, `ipfs-space`) written in TypeScript
- `gcs/` - Assets synced to Google Cloud Storage
- `r2/` - Static assets synced to Cloudflare R2
- `ipfs/` - Fleek IPFS storage assets
- `.github/workflows/` - CI/CD GitHub Actions pipelines
- `.github/dependabot.yml` - Dependabot automated dependency management

## Common Commands

- `pnpm install` - Install monorepo dependencies
- `pnpm run typecheck` - Run TypeScript typechecks across workspaces
- `pnpm run test` - Run Vitest tests across worker workspaces
- `pnpm run lint` - Run ESLint flat config
- `pnpm run fmt` - Format codebase using Trunk / Prettier
- `pnpm run check` - Run Trunk linter suite

## Conventions

- Package manager: `pnpm` (workspace mode)
- Node target: `>=22`
- Worker runtime: Cloudflare Workers with `@cloudflare/workers-types`
- Test framework: `vitest`
