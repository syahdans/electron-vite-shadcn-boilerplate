interface ImportMetaEnv {
  readonly MV_MEKARI_CLIENT_ID: string
  readonly MV_MEKARI_CLIENT_SECRET: string
  readonly MV_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
