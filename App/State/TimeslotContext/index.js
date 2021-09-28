/* eslint max-lines: 0 */ // --> OFF
import React, {createContext, useCallback, useReducer} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {api} from '@/State/Services/api';

const format12Hours = (hours) => {
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return [hours, ampm];
};

import {
  ADD_TIMESLOT,
  ADD_TIMESLOT_FAILURE,
  ADD_TIMESLOT_SUCCESS,
  REMOVE_TIMESLOT,
  REMOVE_TIMESLOT_SUCCESS,
  REMOVE_TIMESLOT_FAILURE,
  GET_TIMESLOTS,
  GET_TIMESLOTS_SUCCESS,
  GET_TIMESLOTS_FAILURE,
  GET_APPOINTMENTS,
  GET_APPOINTMENTS_FAILURE,
  GET_APPOINTMENTS_SUCCESS,
  REMOVE_APPOINTMENT,
  REMOVE_APPOINTMENT_FAILURE,
  REMOVE_APPOINTMENT_SUCCESS,
} from './actions';

export const TimeslotStore = createContext();
const initialState = {
  timeslots: null,
  appointments: null,
  loading: false,
};

function reducer(state, action) {
  switch (action.type) {
    case ADD_TIMESLOT:
      return {
        ...state,
        loading: true,
      };
    case ADD_TIMESLOT_FAILURE:
      return {
        ...state,
        loading: false,
      };
    case ADD_TIMESLOT_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case REMOVE_TIMESLOT:
      return {
        ...state,
        loading: true,
      };
    case REMOVE_TIMESLOT_FAILURE:
      return {
        ...state,
        loading: false,
      };
    case REMOVE_TIMESLOT_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case GET_TIMESLOTS:
      return {
        ...state,
        loading: true,
      };
    case GET_TIMESLOTS_SUCCESS:
      return {
        ...state,
        loading: false,
        timeslots: action.payload,
      };
    case GET_TIMESLOTS_FAILURE:
      return {
        ...state,
        loading: false,
      };
    case GET_APPOINTMENTS:
      return {
        ...state,
        loading: true,
      };
    case GET_APPOINTMENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        appointments: action.payload.data,
      };
    case GET_APPOINTMENTS_FAILURE:
      return {
        ...state,
        loading: false,
      };
    case REMOVE_APPOINTMENT:
      return {
        ...state,
        loading: true,
      };
    case REMOVE_APPOINTMENT_FAILURE:
      return {
        ...state,
        loading: false,
      };
    case REMOVE_APPOINTMENT_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
}

export function TimeslotProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const getTimeslots = useCallback(
    (influencer_id) => {
      dispatch({type: GET_TIMESLOTS});
      return api.migrate
        .get(`/influencer/timeslots/${influencer_id}`)
        .then((response) => response.data.schedules)
        .then((resp) => {
          const timeslotArr = [];
          if (resp) {
            resp.map((timeslot) => {
              const availableDays = [];
              let startTime, endTime;

              timeslot.items.map((item) => {
                availableDays.push(item.start_day);
                startTime = item.start_time;
                endTime = item.end_time;
              });

              timeslotArr.push({
                items: timeslot.influencer_items,
                id: timeslot.schedule_data.id,
                days: availableDays,
                is_default: timeslot.schedule_data.is_default,
                startTime: format12Hours(startTime),
                endTime: format12Hours(endTime),
              });
            });
          }
          dispatch({type: GET_TIMESLOTS_SUCCESS, payload: timeslotArr});
          return resp;
        })
        .catch((err) => {
          dispatch({type: GET_TIMESLOTS_FAILURE, payload: err});
          throw err;
        });
    },
    [dispatch],
  );

  const saveTimeslot = useCallback(
    (timeslotData) => {
      dispatch({type: ADD_TIMESLOT});
      const handler = timeslotData.id ? api.migrate.patch : api.migrate.post;

      return handler('/influencer/timeslots', timeslotData)
        .then((response) => response.data)
        .then((resp) => {
          dispatch({type: ADD_TIMESLOT_SUCCESS, payload: resp});
          return resp;
        })
        .catch((err) => {
          dispatch({type: ADD_TIMESLOT_FAILURE, payload: err});
          throw err;
        });
    },
    [dispatch],
  );

  const removeTimeslot = useCallback(
    (timeslotId) => {
      dispatch({type: REMOVE_TIMESLOT});
      return api.migrate
        .delete(`/influencer/timeslots/${timeslotId}`)
        .then((response) => response.data)
        .then((resp) => {
          dispatch({type: REMOVE_TIMESLOT_SUCCESS, payload: resp});
          return resp;
        })
        .catch((err) => {
          dispatch({type: REMOVE_TIMESLOT_FAILURE, payload: err});
          throw err;
        });
    },
    [dispatch],
  );

  const getAppointments = useCallback(
    (influencer_timezone) => {
      dispatch({type: GET_APPOINTMENTS});
      return api
        .get(
          `/influencer/appointments?offset=${encodeURI(influencer_timezone)}`,
        )
        .then((response) => response.data)
        .then((resp) => {
          dispatch({type: GET_APPOINTMENTS_SUCCESS, payload: resp});
          return resp;
        })
        .catch((err) => {
          dispatch({type: GET_APPOINTMENTS_FAILURE, payload: err});
          throw err;
        });
    },
    [dispatch],
  );

  const removeAppointment = useCallback(
    (id) => {
      dispatch({type: REMOVE_APPOINTMENT});
      return api
        .delete(`/influencer/appointments/${id}`)
        .then((response) => response.data)
        .then((resp) => {
          dispatch({type: REMOVE_APPOINTMENT_SUCCESS, payload: resp});
          return resp;
        })
        .catch((err) => {
          dispatch({type: REMOVE_APPOINTMENT_FAILURE, payload: err});
          throw err;
        });
    },
    [dispatch],
  );

  const value = {
    state,
    dispatch,
    actions: {
      getTimeslots,
      saveTimeslot,
      removeTimeslot,
      getAppointments,
      removeAppointment,
    },
  };

  return (
    <TimeslotStore.Provider value={value}>
      {props.children}
    </TimeslotStore.Provider>
  );
}
