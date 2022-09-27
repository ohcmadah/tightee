/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_FIREBASE_ADMIN_TYPE: string;
  readonly VITE_FIREBASE_ADMIN_PRIVATE_KEY_ID: string;
  readonly VITE_FIREBASE_ADMIN_PRIVATE_KEY: string;
  readonly VITE_FIREBASE_ADMIN_CLIENT_EMAIL: string;
  readonly VITE_FIREBASE_ADMIN_CLIENT_ID: string;
  readonly VITE_FIREBASE_ADMIN_AUTH_URI: string;
  readonly VITE_FIREBASE_ADMIN_TOKEN_URI: string;
  readonly VITE_FIREBASE_ADMIN_AUTH_PROVIDER_CERT_URL: string;
  readonly VITE_FIREBASE_ADMIN_CLIENT_CERT_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
