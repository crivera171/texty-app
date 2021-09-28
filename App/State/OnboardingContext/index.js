/* eslint max-lines: 0 */ // --> OFF
import React, {createContext, useCallback, useReducer} from 'react';
import {api} from '@/State/Services/api';

import {
  UPDATE_ONBOARDING_INFO,
  UPDATE_ONBOARDING_INFO_FAILURE,
  UPDATE_ONBOARDING_INFO_SUCCESS,
  FETCH_ONBOARDING_INFO,
  FETCH_ONBOARDING_INFO_SUCCESS,
  FETCH_ONBOARDING_INFO_FAILURE,
  GET_TASKS,
  GET_TASKS_FAILURE,
  GET_TASKS_SUCCESS,
  COMPLETE,
} from './actions';

export const OnboardingStore = createContext();
const initialState = {
  onboardingStep: '',
  approved: '',
  hasOnboarded: '',
  tasks: {},
  loading: false,
};

function reducer(state, action) {
  switch (action.type) {
    case FETCH_ONBOARDING_INFO:
      return {
        ...state,
        loading: true,
      };

    case FETCH_ONBOARDING_INFO_SUCCESS:
      return {
        onboardingStep: action.payload.onboardingStep,
        approved: action.payload.approved,
        hasOnboarded: action.payload.has_onboarded,
        loading: false,
      };

    case FETCH_ONBOARDING_INFO_FAILURE:
      return {
        ...state,
        loading: false,
      };

    case UPDATE_ONBOARDING_INFO:
      return {
        ...state,
        loading: true,
      };

    case UPDATE_ONBOARDING_INFO_SUCCESS:
      return {
        onboardingStep: action.payload.onboardingStep,
        approved: action.payload.approved,
        hasOnboarded: action.payload.has_onboarded,
        loading: false,
      };

    case UPDATE_ONBOARDING_INFO_FAILURE:
      return {
        ...state,
        loading: false,
      };

    case GET_TASKS:
      return {
        ...state,
        loading: true,
      };

    case COMPLETE:
      return {
        ...state,
        onboardingStep: 'profilePage',
        hasOnboarded: true,
      };

    case GET_TASKS_SUCCESS:
      return {
        ...state,
        tasks: action.payload,
        loading: false,
      };

    case GET_TASKS_FAILURE:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}

export function OnboardingProvider(props) {
  const [onboardingState, dispatch] = useReducer(reducer, initialState);

  const fetchOnboardingInfo = useCallback(
    (profile) => {
      dispatch({type: FETCH_ONBOARDING_INFO});
      return api
        .get('/influencer/profile', profile)
        .then((response) => response.data)
        .then((resp) => {
          dispatch({type: FETCH_ONBOARDING_INFO_SUCCESS, payload: resp});
          return resp;
        })
        .catch((err) => {
          dispatch({type: FETCH_ONBOARDING_INFO_FAILURE, payload: err});
          throw err;
        });
    },
    [dispatch],
  );

  const editOnboardingInfo = useCallback(
    (profileData) => {
      dispatch({type: UPDATE_ONBOARDING_INFO});
      return api
        .patch('/influencer/profile', profileData)
        .then((response) => response.data)
        .then((resp) => {
          dispatch({type: UPDATE_ONBOARDING_INFO_SUCCESS, payload: resp});
          return resp;
        })
        .catch((err) => {
          dispatch({type: UPDATE_ONBOARDING_INFO_FAILURE, payload: err});
          throw err;
        });
    },
    [dispatch],
  );

  const getInfluencerTasks = useCallback(() => {
    dispatch({type: GET_TASKS});
    return api
      .get('/influencer/tasks')
      .then((response) => response.data)
      .then((resp) => {
        dispatch({type: GET_TASKS_SUCCESS, payload: resp});
        return resp;
      })
      .catch((err) => {
        dispatch({type: GET_TASKS_FAILURE, payload: err});
        throw err;
      });
  }, [dispatch]);

  const complete = useCallback(() => {
    dispatch({type: COMPLETE});
  }, [dispatch]);

  const value = {
    onboardingState,
    dispatch,
    onboardingActions: {
      editOnboardingInfo,
      fetchOnboardingInfo,
      getInfluencerTasks,
      complete,
    },
  };

  return (
    <OnboardingStore.Provider value={value}>
      {props.children}
    </OnboardingStore.Provider>
  );
}
