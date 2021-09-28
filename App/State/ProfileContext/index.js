/* eslint max-lines: 0 */ // --> OFF
import React, {createContext, useCallback, useReducer} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {api} from '@/State/Services/api';

import {
  CREATE_PROFILE,
  CREATE_PROFILE_FAILURE,
  CREATE_PROFILE_SUCCESS,
  UPDATE_PROFILE,
  UPDATE_PROFILE_FAILURE,
  UPDATE_PROFILE_SUCCESS,
  COMPLETE_SIGNUP_START,
  COMPLETE_SIGNUP_FINISH,
  GET_TWILIONUMBERS,
  GET_TWILIONUMBERS_SUCCESS,
  GET_TWILIONUMBERS_FAILURE,
  SELECT_NUMBER,
  SELECT_NUMBER_SUCCESS,
  SELECT_NUMBER_FAILURE,
  FETCH_PROFILE,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_FAILURE,
  CREATE_PROFILE_VIDEO,
  CREATE_PROFILE_VIDEO_SUCCESS,
  CREATE_PROFILE_VIDEO_FAILURE,
  FETCH_REVIEWS,
  FETCH_REVIEWS_SUCCESS,
  FETCH_REVIEWS_FAILURE,
  FETCH_CREDIT_HISTORY,
  FETCH_CREDIT_HISTORY_FAILURE,
  FETCH_CREDIT_HISTORY_SUCCESS,
  FETCH_ITEM_TEMPLATES,
  FETCH_ITEM_TEMPLATES_FAILURE,
  FETCH_ITEM_TEMPLATES_SUCCESS,
} from './actions';
import Config from 'react-native-config';
import {MediaService} from '@/State/Services/media.js';
import {catchError} from 'rxjs/operators';

export const ProfileStore = createContext();
const initialState = {
  profile: {
    id: '',
    email: '',
    full_name: '',
    profession: '',
    bio: '',
    personal_phone: '',
    twilio_phone_number: '',
    twilio_phone_id: '',
    profile_image_url: '',
    message_rule: '',
    gender: '',
    dob: '',
    zip: '',
    marital_status: '',
    timezone: '',
    timezone_name: '',
  },
  hasFetched: false,
  loading: null,
  twilioNumberList: [],
  creditHistory: [],
  token: '',
  tasks: [],
  reviews: [],
};

function reducer(state, action) {
  switch (action.type) {
    case COMPLETE_SIGNUP_START:
      return {
        ...state,
      };
    case COMPLETE_SIGNUP_FINISH:
      return {
        ...state,
        loading: false,
        hasFetched: true,
      };
    case CREATE_PROFILE:
      return {
        ...state,
        loading: true,
      };

    case CREATE_PROFILE_FAILURE:
      return {
        ...state,
        loading: false,
      };

    case CREATE_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        token: action.payload?.token,
        profile: action.payload?.influencer,
        hasFetched: true,
      };

    case FETCH_PROFILE:
      return {
        ...state,
        loading: true,
      };

    case FETCH_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        profile: action.payload,
        hasFetched: true,
      };

    case FETCH_PROFILE_FAILURE:
      return {
        ...state,
        loading: false,
      };

    case UPDATE_PROFILE:
      return {
        ...state,
        loading: true,
      };

    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        profile: {
          ...state.profile,
          ...action.payload,
        },
      };

    case UPDATE_PROFILE_FAILURE:
      return {
        ...state,
        loading: false,
      };

    case GET_TWILIONUMBERS:
      return {
        ...state,
        loading: true,
      };

    case GET_TWILIONUMBERS_SUCCESS:
      return {
        ...state,
        loading: false,
        twilioNumberList: action.payload,
      };

    case GET_TWILIONUMBERS_FAILURE:
      return {
        ...state,
        loading: false,
      };

    case SELECT_NUMBER:
      return {
        ...state,
        loading: true,
      };

    case SELECT_NUMBER_SUCCESS:
      return {
        ...state,
        loading: false,
        profile: {
          ...state.profile,
          twilio_phone_number: action.payload.twilio_phone_number,
          twilio_phone_id: action.payload.twilio_phone_id,
        },
      };

    case SELECT_NUMBER_FAILURE:
      return {
        ...state,
        loading: false,
      };

    case FETCH_REVIEWS: {
      return {
        ...state,
        loading: true,
      };
    }

    case FETCH_REVIEWS_SUCCESS:
      return {
        ...state,
        loading: false,
        reviews: action.payload,
      };

    case FETCH_REVIEWS_FAILURE:
      return {
        ...state,
        loading: false,
      };

    case FETCH_CREDIT_HISTORY:
      return {
        ...state,
        loading: true,
      };

    case FETCH_CREDIT_HISTORY_SUCCESS:
      return {
        ...state,
        loading: false,
        creditHistory: action.payload,
      };

    case FETCH_CREDIT_HISTORY_FAILURE:
      return {
        ...state,
        loading: false,
      };

    case FETCH_ITEM_TEMPLATES:
      return {
        ...state,
        loading: true,
      };

    case FETCH_ITEM_TEMPLATES_SUCCESS:
      return {
        ...state,
        loading: true,
        itemTemplates: action.payload,
      };

    case FETCH_ITEM_TEMPLATES_FAILURE:
      return {
        ...state,
        loading: true,
      };

    default:
      return state;
  }
}

export function ProfileProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const createProfile = useCallback(
    (profileData) => {
      dispatch({type: UPDATE_PROFILE});

      return api
        .post('/influencers/signup', profileData)
        .then((response) => response.data)
        .then((resp) => {
          dispatch({type: CREATE_PROFILE_SUCCESS, payload: resp});
          AsyncStorage.setItem('AUTH_TOKEN', resp.token);
          return resp;
        })
        .catch((err) => {
          dispatch({type: UPDATE_PROFILE_FAILURE, payload: err});
          throw err;
        });
    },
    [dispatch],
  );

  const fetchProfile = useCallback(
    (profile) => {
      dispatch({type: FETCH_PROFILE});
      return api.migrate
        .get('/influencer/profile', profile)
        .then((response) => response.data)
        .then((resp) => {
          dispatch({type: FETCH_PROFILE_SUCCESS, payload: resp});
          return resp;
        })
        .catch((err) => {
          dispatch({type: FETCH_PROFILE_FAILURE, payload: err});
          throw err;
        });
    },
    [dispatch],
  );

  const editProfile = useCallback(
    (profileData) => {
      dispatch({type: UPDATE_PROFILE});
      return api
        .patch('/influencer/profile', profileData)
        .then((response) => response.data)
        .then((resp) => {
          dispatch({type: UPDATE_PROFILE_SUCCESS, payload: resp});
          return resp;
        })
        .catch((err) => {
          dispatch({type: UPDATE_PROFILE_FAILURE, payload: err});
          throw err;
        });
    },
    [dispatch],
  );

  const editTimezone = useCallback(
    async (timezone_name) => {
      return api.migrate
        .patch('/influencer/profile/timezone', {timezone_name})
        .then((result) => {
          dispatch({type: UPDATE_PROFILE_SUCCESS, payload: result.data});
          return result;
        })
        .catch((e) => e.response?.data);
    },
    [dispatch],
  );

  const getTwilioNumbers = useCallback(
    (locationData) => {
      return api
        .get('/influencer/available-phones', {params: locationData})
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

  const selectTwilioNumber = useCallback(
    (twilioNumber) => {
      dispatch({type: SELECT_NUMBER});
      return api
        .post('/influencer/provision-phone', twilioNumber)
        .then((response) => response.data)
        .then((resp) => {
          dispatch({type: SELECT_NUMBER_SUCCESS, payload: resp});
          return resp;
        })
        .catch((err) => {
          dispatch({type: SELECT_NUMBER_FAILURE, payload: err});
          throw err;
        });
    },
    [dispatch],
  );

  const uploadProfileVideo = useCallback(
    (file_uri, size, duration) => {
      console.log(file_uri, size, duration);
      dispatch({type: CREATE_PROFILE_VIDEO});
      return api
        .post('/media/create', {
          file: file_uri,
          media_type: 'video',
          file_size: size,
          media_duration: duration,
        })
        .then((response) => response.data)
        .then(({data: r}) => {
          return MediaService.uploadVideo(
            r,
            file_uri,
            'mp4',
            'video/mp4',
            false,
          )
            .then((resp) => {
              return {...resp, id: r.id};
            })
            .catch((err) => {
              console.log('Error in upload', err);
            });
        });
    },
    [dispatch],
  );
  const syncCalendarEvents = useCallback((type) => {
    return api.migrate
      .post('/influencer/calendar/auth-url', {type})
      .then((response) => response.data);
  });

  const fetchReviews = useCallback(
    (influencer_id) => {
      dispatch({type: FETCH_REVIEWS});
      return api
        .get(`/influencer/${influencer_id}/reviews`)
        .then((response) => response.data)
        .then((resp) => {
          dispatch({type: FETCH_REVIEWS_SUCCESS, payload: resp});
          return resp;
        })
        .catch((err) => {
          dispatch({type: FETCH_REVIEWS_FAILURE, payload: err});
          throw err;
        });
    },
    [dispatch],
  );

  const fetchCreditHistory = useCallback(() => {
    dispatch({type: FETCH_CREDIT_HISTORY});
    return Promise.resolve(true);
  }, [dispatch]);

  const value = {
    state,
    dispatch,
    actions: {
      createProfile,
      editProfile,
      editTimezone,
      getTwilioNumbers,
      selectTwilioNumber,
      fetchProfile,
      uploadProfileVideo,
      syncCalendarEvents,
      fetchReviews,
      fetchCreditHistory,
    },
  };

  return (
    <ProfileStore.Provider value={value}>
      {props.children}
    </ProfileStore.Provider>
  );
}
