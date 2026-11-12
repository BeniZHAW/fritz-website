interface ImportMetaEnv {
  readonly PUBLIC_ORDER_API_URL?: string;
  /** 'true' beim Build fuer die GitHub-Pages-Vorschau. */
  readonly PUBLIC_PREVIEW?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
