import AsyncStorage from '@react-native-async-storage/async-storage';
import get from 'lodash/get';
import axios from 'axios';
import authSubject from 'State/Services/authSubject';
import { ENDPOINT_URL, MIGRATE_ENDPOINT_URL } from "State/Constants"

const api = axios.create({
    baseURL: `${ENDPOINT_URL}`,
});

const migrateApi = axios.create({
  baseURL: MIGRATE_ENDPOINT_URL
});

const requestSuccessInterceptor = async (config) => {
  const token = await AsyncStorage.getItem('AUTH_TOKEN');
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  config.headers['Content-Type'] = 'application/json;charset=utf-8';

  if (__DEV__) {
    console.log("Api REQUEST: ", config.method, config.url);
  }

  return config;
}

const requestFailureInterceptor = (err) => {
  if (__DEV__) {
    console.log("Api REQUEST error: ", config.url);
    console.log(err);
  }
  return Promise.reject(err);
}

const responseSuccessInterceptor = (res) => res // shrug

const responseFailureInterceptor = (error) => {
  if (
      get(error, 'response.status') === 401 ||
      get(error, 'response.status') === 403 &&
      !__DEV__
  ) {
    authSubject.next({ type: 'LOGOUT' });
  }

  if (__DEV__) {
    console.log("Api Error Response: ", error);
  }

  throw error;
}

[api, migrateApi].map(client => {
  client.interceptors.request.use(requestSuccessInterceptor, requestFailureInterceptor);
  client.interceptors.response.use(responseSuccessInterceptor(), responseFailureInterceptor);
  client.defaults.headers.common['Content-Type'] = 'application/json;charset=utf-8';
})

// expose
api.migrate = migrateApi

export { api };
