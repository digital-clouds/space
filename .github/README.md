# `Space`

## Deployments

### Buckets

[GitHub Actions](.github/workflows/gcp-action.yml) uploads files to Google Cloud Storage from `gcp/*` directories to the following bucket paths respectively:

- gs://digital-space/gcs/63ab8820-bc9f-43aa-9045-801ac5af4bb6
- gs://gcp-space/gcs/2d8aa135-97c0-4ab1-8443-2eafcec4055e

## Development

### Install

```shell
pnpm i
```

### [Workers](https://developers.cloudflare.com/workers/)

#### cdn.digitalclouds.dev

Start a local server for developing worker:

```shell
pnpm run start
```

Publish your Worker to Cloudflare:

```shell
pnpm run deploy
```

#### ipfs.digitalclouds.dev

Start a local server for developing worker:

```shell
pnpm run start --env ipfs-bucket
```

Publish your Worker to Cloudflare:

```shell
pnpm run deploy --env ipfs-bucket
```

### [Trunk](https://docs.trunk.io/docs)

Universal code checker

```shell
pnpm check
```

Universal code formatter

```shell
pnpm fmt
```
