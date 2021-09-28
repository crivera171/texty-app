import React, {createContext, useCallback, useReducer} from 'react';
import {
  GET_OVERVIEW,
  GET_OVERVIEW_FAILURE,
  GET_OVERVIEW_SUCCESS,
  GET_PAYMENTS,
  GET_PAYMENTS_SUCCESS,
  GET_PAYMENTS_FAILURE,
  GET_TRANSACTIONS,
  GET_TRANSACTIONS_FAILURE,
  GET_TRANSACTIONS_SUCCESS,
} from './actions';

export const DashboardStore = createContext();
import {api} from '@/State/Services/api.js';

const initialState = {
  loading: false,
  overview: {},
  payments: [],
  transactions: [],
  paymentOverview: {},
};

function reducer(state, action) {
  switch (action.type) {
    case GET_OVERVIEW:
      return {
        ...state,
        loading: true,
      };

    case GET_OVERVIEW_SUCCESS:
      return {
        ...state,
        loading: false,
        overview: action.payload,
      };

    case GET_OVERVIEW_FAILURE:
      return {
        ...state,
        loading: false,
      };

    case GET_PAYMENTS:
      return {
        ...state,
        loading: true,
      };

    case GET_PAYMENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        paymentOverview: action.payload,
      };

    case GET_PAYMENTS_FAILURE:
      return {
        ...state,
        loading: false,
      };

    case GET_TRANSACTIONS:
      return {
        ...state,
        loading: true,
      };

    case GET_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        transactions: action.payload.data,
      };

    case GET_TRANSACTIONS_FAILURE:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}

export function DashboardProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const getOverview = useCallback((period) => {
    return api.migrate
      .post('/influencer/metrics/summary', {period})
      .then((response) => response.data)
      .then((resp) => {
        return resp;
      })
      .catch((err) => {
        throw err;
      });
  }, []);

  const getChartData = useCallback((period, metric) => {
    return api.migrate
      .post('/influencer/metrics/graph', {period, metric})
      .then((response) => response.data)
      .then((resp) => {
        return resp;
      })
      .catch((err) => {
        throw err;
      });
  }, []);

  const getPayments = useCallback(() => {
    dispatch({type: GET_PAYMENTS});
    return api
      .get('/influencer/payments')
      .then((response) => response.data)
      .then((data) => {
        dispatch({
          type: GET_PAYMENTS_SUCCESS,
          payload: data,
        });
        return data;
      })
      .catch((err) => {
        dispatch({type: GET_PAYMENTS_FAILURE, payload: err});
        throw err;
      });
  }, [dispatch]);

  const getTransactions = useCallback(() => {
    dispatch({type: GET_TRANSACTIONS});
    return api
      .get('/influencer/orders/')
      .then((response) => response.data)
      .then((data) => {
        dispatch({
          type: GET_TRANSACTIONS_SUCCESS,
          payload: {
            data,
          },
        });
        return [];
      })
      .catch((err) => {
        dispatch({type: GET_TRANSACTIONS_FAILURE, payload: err});
        throw err;
      });
  }, [dispatch]);

  const value = {
    state,
    dispatch,
    actions: {
      getOverview,
      getChartData,
      getPayments,
      getTransactions,
    },
  };

  return (
    <DashboardStore.Provider value={value}>
      {props.children}
    </DashboardStore.Provider>
  );
}
