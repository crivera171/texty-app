import React, {createContext, useCallback, useReducer} from 'react';
import {
  GET_CONTACTS,
  GET_CONTACTS_FAILURE,
  GET_CONTACTS_SUCCESS,
  GET_CONTACTDETAIL,
  GET_CONTACTDETAIL_SUCCESS,
  GET_CONTACTDETAIL_FAILURE,
  GET_UNREGISTERED_CONTACTS,
  GET_UNSUBSCRIBED_CONTACTS_SUCCESS,
  GET_UNSUBSCRIBED_CONTACTS_FAILURE,
  GET_UNSUBSCRIBED_CONTACTS,
} from './actions';

import keyBy from 'lodash/keyBy';
import {api} from '@/State/Services/api.js';

export const ContactStore = createContext();

const initialState = {
  loading: false,
  contacts: {},
  unsubscribed_contacts: {},
  unregistered_contacts: {},
};

function reducer(state, action) {
  switch (action.type) {
    case GET_CONTACTS:
      return {
        ...state,
        loading: true,
      };

    case GET_CONTACTS_SUCCESS:
      return {
        ...state,
        loading: false,
        contacts: {
          ...state.contacts,
          ...keyBy(action.payload.contacts, 'contact_id'),
        },
      };

    case GET_CONTACTS_FAILURE:
      return {
        ...state,
        loading: false,
      };

    case GET_CONTACTDETAIL:
      return {
        ...state,
        loading: true,
      };

    case GET_CONTACTDETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case GET_CONTACTDETAIL_FAILURE:
      return {
        ...state,
        loading: false,
      };

    case GET_UNSUBSCRIBED_CONTACTS:
      return {
        ...state,
        loading: true,
      };
    case GET_UNSUBSCRIBED_CONTACTS_FAILURE:
      return {
        ...state,
        loading: false,
      };
    case GET_UNSUBSCRIBED_CONTACTS_SUCCESS:
      console.log(action.payload.contacts);
      return {
        ...state,
        loading: false,
        unsubscribed_contacts: {
          ...state.unsubscribed_contacts,
          ...keyBy(action.payload.contacts, 'contact_id'),
        },
      };

    case GET_UNREGISTERED_CONTACTS:
      return {
        ...state,
        loading: true,
      };

    default:
      return state;
  }
}

export function ContactProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const getUnsubscribedContacts = useCallback(() => {
    dispatch({type: GET_UNREGISTERED_CONTACTS});
    return api
      .get('/influencer/contacts/unsubscribed')
      .then(({data: {data: contacts}}) => {
        console.log('CONTACTS', contacts);
        dispatch({
          type: GET_UNSUBSCRIBED_CONTACTS_SUCCESS,
          payload: {
            contacts,
          },
        });
      })
      .catch((err) => {
        dispatch({type: GET_UNSUBSCRIBED_CONTACTS_FAILURE, payload: err});
        throw err;
      });
  }, [dispatch]);

  const getContacts = useCallback(() => {
    dispatch({type: GET_CONTACTS});
    return api
      .get('/influencer/contacts')
      .then((response) => response.data)
      .then(({data: contacts}) => {
        dispatch({
          type: GET_CONTACTS_SUCCESS,
          payload: {
            contacts,
          },
        });
        return contacts;
      })
      .catch((err) => {
        dispatch({type: GET_CONTACTS_FAILURE, payload: err});
        throw err;
      });
  }, [dispatch]);

  const getContact = useCallback(
    (contact_id) => {
      dispatch({type: GET_CONTACTDETAIL});
      return api
        .get(`/influencer/contacts/${contact_id}`)
        .then((response) => response.data)
        .then((resp) => {
          dispatch({type: GET_CONTACTDETAIL_SUCCESS, payload: resp});
          return resp;
        })
        .catch((err) => {
          dispatch({type: GET_CONTACTDETAIL_FAILURE, payload: err});
          throw err;
        });
    },
    [dispatch],
  );

  const banContact = useCallback(({contact_id, banned}) => {
    return api
      .post(`/influencer/contacts/${contact_id}/toggleBan`, {banned})
      .then((response) => response.data)
      .then(() => {
        return;
      })
      .catch((err) => {
        throw err;
      });
  });

  const value = {
    state,
    dispatch,
    actions: {
      getContacts,
      getContact,
      getUnsubscribedContacts,
      banContact,
    },
  };

  return (
    <ContactStore.Provider value={value}>
      {props.children}
    </ContactStore.Provider>
  );
}
