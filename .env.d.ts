interface ImportMetaEnv {
  readonly VITE_NETWORK: string
  readonly VITE_DIRECTORY_APP_ID: string
  readonly VITE_NFD_PARENT_APP_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
