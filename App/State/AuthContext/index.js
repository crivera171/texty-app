import {
  INITIALIZE_AUTH_FINISH,
  INITIALIZE_AUTH_START,
  LOGIN,
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  LOGOUT,
  LOGOUT_SUCCESS,
  PUSH_TOKEN
} from './actions';
import React, { createContext, useCallback, useEffect, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENDPOINT_URL, MIGRATE_ENDPOINT_URL } from '@/State/Constants';
import { api } from "@/State/Services/api";

export const AuthStore = createContext();

const initialState = {
  user: null,
  token: null,
  loading: null,
  // Signals to rest of the app that we have checked if the user is authenticated
  initialized: false,
};

function reducer(state, action) {
  switch (action.type) {
    case INITIALIZE_AUTH_START:
      return {
        ...state,
      };
    case INITIALIZE_AUTH_FINISH:
      return {
        ...state,
        token: action.payload?.token,
        initialized: true,
      };
    case LOGIN:
      return {
        ...state,
        loading: true,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload?.user,
        token: action.payload?.token,
        loading: false,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        initialized: false,
      };
    default:
      return state;
  }
}

export function AuthProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // find async storage
    dispatch({ type: INITIALIZE_AUTH_START, payload: null });
    AsyncStorage.getItem('AUTH_TOKEN').then((token) => {
      dispatch({ type: INITIALIZE_AUTH_FINISH, payload: { token } });
    });
  }, []);

  const loginAction = useCallback(
    async ({ email, password }) => {
      try {
        dispatch({ type: LOGIN, payload: resp });

        if (__DEV__) {
          console.log(`Logging in to URL: ${MIGRATE_ENDPOINT_URL}/login/influencer`);
        }
        const push_token = await AsyncStorage.getItem('PUSH_TOKEN');
        const resp = await api.migrate.post('/login/influencer',{
          email,
          password,
          push_token
        })
          .then(({data}) => data)
          .catch(async (e) => {
            if (`${data.status}`[0] !== '2') {
              if (__DEV__) {
                console.log('Login Error: ', e.message);
              }

              const error = new Error('Error logging in');
              error.message = e.message
              throw error;
            }
            return data;
          })


        await AsyncStorage.setItem('AUTH_TOKEN', resp.token);
        dispatch({ type: LOGIN_SUCCESS, payload: resp });
      } catch (err) {
        dispatch({ type: LOGIN_FAILURE, payload: err });
        if (__DEV__) {
          console.log('Login Error: ', err);
        }

        throw err;
      }
    },
    [dispatch],
  );

  const logoutAction = useCallback(() => {
    (async () => {
      try {
        dispatch({ type: LOGOUT, payload: resp });
        const resp = await fetch(`${ENDPOINT_URL}/logout`).then((data) =>
          data.json(),
        );

        dispatch({ type: LOGOUT_SUCCESS, payload: resp });
      } catch (err) {
        dispatch({ type: LOGOUT_SUCCESS });
      }
    })();
  });

  const pushToken = useCallback(
    (data) => {
      return api
        .patch('/influencer/profile', data)
        .then((response) => response.data)
        .then((resp) => {
          return resp;
        })
        .catch((err) => {
          throw err;
        });
    },
    [dispatch],
  );

  const value = {
    state,
    authActions: {
      loginAction,
      logoutAction,
      pushToken
    },
    dispatch,
  };
  return (
    <AuthStore.Provider value={value}>{props.children}</AuthStore.Provider>
  );
}
