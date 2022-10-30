# `Space`

## Deployments

[GitHub Actions](.github/workflows/gcp-action.yml) uploads files to Google Cloud Storage from `gcp/*` directories to the following bucket paths respectively:

- gs://digital-space/gcs/63ab8820-bc9f-43aa-9045-801ac5af4bb6
- gs://gcp-space/gcs/2d8aa135-97c0-4ab1-8443-2eafcec4055e

## Development

```shell
# Install
pnpm i
```
```shell
# Universal code checker/formatter
pnpm check
pnpm fmt
```

Bucket: https://cdn.digitalclouds.dev

```shell
# Start a local server for developing worker
pnpm run start
```
```shell
# Publish Worker to Cloudflare
pnpm run deploy
```

Bucket: https://ipfs.digitalclouds.dev

```shell
# Start a local server for developing worker
pnpm run start --env ipfs-bucket
```
```
# Publish Worker to Cloudflare
pnpm run deploy --env ipfs-bucket
```
