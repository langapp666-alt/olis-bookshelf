/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_AFFILIATE_TAG?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
