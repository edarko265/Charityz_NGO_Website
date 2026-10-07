/// <reference types="vite/client" /> 

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface PaystackHandler {
  openIframe: () => void;
}

interface Window {
  // Loaded from https://js.paystack.co/v1/inline.js in index.html
  PaystackPop: {
    setup: (options: Record<string, unknown>) => PaystackHandler;
  };
}
