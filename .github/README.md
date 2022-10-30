# `Space`

## Deployments

[GitHub Actions](.github/workflows/gcp-action.yml) uploads files to Google Cloud Storage from repository paths to the following bucket paths respectively:

- [gcp/63ab8820-bc9f-43aa-9045-801ac5af4bb6](https://github.com/digital-clouds/space/tree/main/gcs/63ab8820-bc9f-43aa-9045-801ac5af4bb6) ➤ [digital-space/63ab8820-bc9f-43aa-9045-801ac5af4bb6](https://storage.googleapis.com/digital-space/63ab8820-bc9f-43aa-9045-801ac5af4bb6)

- [gcp/2d8aa135-97c0-4ab1-8443-2eafcec4055e](https://github.com/digital-clouds/space/tree/main/gcs/2d8aa135-97c0-4ab1-8443-2eafcec4055e) ➤ [gcp-space/2d8aa135-97c0-4ab1-8443-2eafcec4055e](https://storage.googleapis.com/gcp-space/2d8aa135-97c0-4ab1-8443-2eafcec4055e)

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

```shell
# Publish Worker to Cloudflare
pnpm run deploy --env ipfs-bucket
```
