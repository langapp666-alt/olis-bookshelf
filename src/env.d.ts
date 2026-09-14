/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_AFFILIATE_TAG?: string;
  readonly PUBLIC_SITE_URL?: string;
  readonly SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
