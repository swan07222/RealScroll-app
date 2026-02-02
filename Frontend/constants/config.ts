// constants/config.ts
const ENV = {
  development: {
    API_URL: 'http://localhost:3000/api',
    USE_MOCKS: true,
  },
  staging: {
    API_URL: 'https://staging-api.realscroll.com/api',
    USE_MOCKS: false,
  },
  production: {
    API_URL: 'https://api.realscroll.com/api',
    USE_MOCKS: false,
  },
};

const CURRENT_ENV = 'development';

export const Config = {
  ...ENV[CURRENT_ENV],
  ENV: CURRENT_ENV,
  APP_NAME: 'RealScroll',
  VERSION: '1.0.0',

  FEATURES: {
    PHONE_AUTH: true,
    SOCIAL_LOGIN: false,
    DARK_MODE: true,
    PUSH_NOTIFICATIONS: true,
  },

  DEFAULT_PAGE_SIZE: 20,
  API_TIMEOUT: 30000,

  STORAGE_KEYS: {
    AUTH_TOKEN: '@realscroll/auth_token',
    REFRESH_TOKEN: '@realscroll/refresh_token',
    USER: '@realscroll/user',
    ONBOARDING_COMPLETE: '@realscroll/onboarding_complete',
    LANGUAGE: '@realscroll/language',
    THEME: '@realscroll/theme',
  },
};