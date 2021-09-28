/* eslint max-lines: 0 */ // --> OFF
import React, {createContext, useCallback, useReducer} from 'react';
import {api} from '@/State/Services/api';

import {
  ADD_SOCIAL_MEDIA,
  ADD_SOCIAL_MEDIA_FAILURE,
  ADD_SOCIAL_MEDIA_SUCCESS,
  REMOVE_SOCIAL_MEDIA,
  REMOVE_SOCIAL_MEDIA_SUCCESS,
  REMOVE_SOCIAL_MEDIA_FAILURE,
  GET_SOCIAL_MEDIA,
  GET_SOCIAL_MEDIA_SUCCESS,
  GET_SOCIAL_MEDIA_FAILURE,
} from './actions';

export const SocialMediaStore = createContext();
const initialState = {
  social_media: [],
  loading: false,
};

function reducer(state, action) {
  switch (action.type) {
    case ADD_SOCIAL_MEDIA:
      return {
        ...state,
        loading: true,
      };
    case ADD_SOCIAL_MEDIA_FAILURE:
      return {
        ...state,
        loading: false,
      };
    case ADD_SOCIAL_MEDIA_SUCCESS:
      return {
        ...state,
        social_media: [...state.social_media, action.payload],
        loading: false,
      };
    case REMOVE_SOCIAL_MEDIA:
      return {
        ...state,
        loading: true,
      };
    case REMOVE_SOCIAL_MEDIA_FAILURE:
      return {
        ...state,
        loading: false,
      };
    case REMOVE_SOCIAL_MEDIA_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case GET_SOCIAL_MEDIA:
      return {
        ...state,
        loading: true,
      };
    case GET_SOCIAL_MEDIA_SUCCESS:
      return {
        ...state,
        loading: false,
        social_media: action.payload.data,
      };
    case GET_SOCIAL_MEDIA_FAILURE:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}

export function SocialMediaProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const getSocialMedia = useCallback(
    (influencer_id) => {
      dispatch({type: GET_SOCIAL_MEDIA});
      return api
        .get(`/influencer/${influencer_id}/social-media`)
        .then((response) => response.data)
        .then((resp) => {
          dispatch({type: GET_SOCIAL_MEDIA_SUCCESS, payload: resp});
          return resp;
        })
        .catch((err) => {
          dispatch({type: GET_SOCIAL_MEDIA_FAILURE, payload: err});
          throw err;
        });
    },
    [dispatch],
  );

  const saveSocialMedia = useCallback(
    (smData) => {
      dispatch({type: ADD_SOCIAL_MEDIA});
      return api
        .post('/influencer/social-media', smData)
        .then((response) => response.data)
        .then((resp) => {
          dispatch({type: ADD_SOCIAL_MEDIA_SUCCESS, payload: resp});
          return resp;
        })
        .catch((err) => {
          dispatch({type: ADD_SOCIAL_MEDIA_FAILURE, payload: err});
          throw err;
        });
    },
    [dispatch],
  );

  const removeSocialMedia = useCallback(
    (smId) => {
      dispatch({type: REMOVE_SOCIAL_MEDIA});
      return api
        .delete(`/influencer/social-media/${smId}`)
        .then((response) => response.data)
        .then((resp) => {
          dispatch({type: REMOVE_SOCIAL_MEDIA_SUCCESS, payload: resp});
          return resp;
        })
        .catch((err) => {
          dispatch({type: REMOVE_SOCIAL_MEDIA_FAILURE, payload: err});
          throw err;
        });
    },
    [dispatch],
  );

  const value = {
    state,
    dispatch,
    actions: {
      getSocialMedia,
      saveSocialMedia,
      removeSocialMedia,
    },
  };

  return (
    <SocialMediaStore.Provider value={value}>
      {props.children}
    </SocialMediaStore.Provider>
  );
}
