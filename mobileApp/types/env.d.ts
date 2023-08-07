declare module "@env" {
  // local
  export const FIREBASE_API_KEY_LOCAL: string;
  export const FIREBASE_AUTH_DOMAIN_LOCAL: string;
  export const FIREBASE_PROJECT_ID_LOCAL: string;
  export const FIREBASE_STORAGE_BUCKET_LOCAL: string;
  export const FIREBASE_MESSAGING_SENDER_ID_LOCAL: string;
  export const FIREBASE_APP_ID_LOCAL: string;

  // testflight
  export const FIREBASE_API_KEY_FLIGHT: string;
  export const FIREBASE_AUTH_DOMAIN_FLIGHT: string;
  export const FIREBASE_PROJECT_ID_FLIGHT: string;
  export const FIREBASE_STORAGE_BUCKET_FLIGHT: string;
  export const FIREBASE_MESSAGING_SENDER_ID_FLIGHT: string;
  export const FIREBASE_APP_ID_FLIGHT: string;
  // production
}
