import Config from 'react-native-config';
import {Platform} from 'react-native';

// Default dev endpoint
const defaultDevEndpoint =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8000/api'
    : 'http://localhost:8000/api';

const defaultMigrateEndpoint =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8000/api/v1'
    : 'http://localhost:8000/api/v1';

// Dev endpoint
const devEndpoint = Config.API_URL ?? defaultDevEndpoint;
const devMigrateEndpoint = Config.MIGRATE_API_URL ?? defaultMigrateEndpoint;

// Production Endpoint
const prodEndpoint = 'https://api.mytexty.com/api';

// Dev App url
const devAppUrl = 'http://localhost:8080';

// Prod app url
const prodAppUrl = 'https://mytexty.com';

export const CHAT_REFRESH_INTERVAL = 8000;
export const APP_URL = __DEV__ ? devAppUrl : prodAppUrl;
export const ENDPOINT_URL = 'https://api.mytexty.com/api'; // __DEV__ ? devEndpoint : prodEndpoint;
export const MIGRATE_ENDPOINT_URL = 'https://migrate-api.mytexty.com/api/v1'; //__DEV__ ? devMigrateEndpoint : ENDPOINT_URL;

// Stripe payment success return hook url
export const BANK_SETUP_REDIRECT_URL = __DEV__
  ? 'https://dev.app.mytexty.com/return'
  : 'https://mytexty.com/return';

// Google calendar link success url
export const GOOGLE_AUTH_SETUP_REDIRECT_URL_SUCCESS = __DEV__
  ? 'https://dev.app.mytexty.com/return-success#'
  : 'https://mytexty.com/return-success#';

// Google calendar link failure url
export const GOOGLE_AUTH_SETUP_REDIRECT_URL_FAILURE = __DEV__
  ? 'https://dev.app.mytexty.com/return-failure#'
  : 'https://mytexty.com/return-failure#';
