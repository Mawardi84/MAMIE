/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FRED_API_KEY: string;
  readonly VITE_OPENAI_API_KEY: string;
  readonly VITE_ENABLE_WEBSOCKET: string;
  readonly VITE_ENABLE_AI_INSIGHTS: string;
  readonly VITE_ENABLE_REAL_TIME_DATA: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_DATA_SOURCE: string;
  readonly VITE_ENVIRONMENT: string;
  readonly VITE_DEBUG: string;
  readonly VITE_GA_ID: string;
  readonly VITE_SENTRY_DSN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
