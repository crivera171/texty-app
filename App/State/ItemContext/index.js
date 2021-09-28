/* eslint max-lines: 0 */ // --> OFF
import React, {createContext, useCallback, useReducer} from 'react';
import {api} from '@/State/Services/api';

import {
  ADD_ITEM,
  ADD_ITEM_SUCCESS,
  ADD_ITEM_FAILURE,
  GET_ITEMS,
  GET_ITEMS_SUCCESS,
  GET_ITEMS_FAILURE,
  REMOVE_ITEM,
  REMOVE_ITEM_SUCCESS,
  REMOVE_ITEM_FAILURE,
  GET_UNSLOTTED_ITEMS,
  ADD_FILES,
  ADD_FILES_SUCCESS,
  ADD_FILES_FAILURE,
  GET_FILES,
  GET_FILES_SUCCESS,
  GET_FILES_FAILURE,
  REMOVE_FILE,
  REMOVE_FILE_SUCCESS,
  REMOVE_FILE_FAILURE,
  FETCH_ITEM_TEMPLATES,
  FETCH_ITEM_TEMPLATES_FAILURE,
  FETCH_ITEM_TEMPLATES_SUCCESS,
  CREATE_FROM_ITEM_TEMPLATE,
  CREATE_FROM_ITEM_TEMPLATE_SUCCESS,
  CREATE_FROM_ITEM_TEMPLATE_FAILURE,
} from './actions';

export const ItemStore = createContext();
const initialState = {
  loading: false,
  unslottedItems: [],
  files: [],
  items: [],
  itemTemplates: [],
};

function reducer(state, action) {
  switch (action.type) {
    case ADD_ITEM:
      return {
        ...state,
        loading: true,
      };

    case ADD_ITEM_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case ADD_ITEM_FAILURE:
      return {
        ...state,
        loading: false,
      };

    case REMOVE_ITEM:
      return {
        ...state,
        loading: true,
      };

    case REMOVE_ITEM_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case REMOVE_ITEM_FAILURE:
      return {
        ...state,
        loading: false,
      };

    case GET_ITEMS:
      return {
        ...state,
        loading: true,
      };

    case GET_UNSLOTTED_ITEMS:
      return {
        ...state,
        unslottedItems: action.payload.items,
      };

    case GET_ITEMS_SUCCESS:
      return {
        ...state,
        items: action.payload.data,
        loading: false,
      };

    case GET_ITEMS_FAILURE:
      return {
        ...state,
        loading: false,
      };

    case ADD_FILES:
      return {
        ...state,
        loading: true,
      };

    case ADD_FILES_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case ADD_FILES_FAILURE:
      return {
        ...state,
        loading: false,
      };

    case GET_FILES:
      return {
        ...state,
        loading: true,
      };

    case GET_FILES_SUCCESS:
      return {
        ...state,
        files: action.payload,
        loading: false,
      };

    case GET_FILES_FAILURE:
      return {
        ...state,
        loading: false,
      };

    case REMOVE_FILE:
      return {
        ...state,
        loading: true,
      };

    case REMOVE_FILE_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case REMOVE_FILE_FAILURE:
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

    case CREATE_FROM_ITEM_TEMPLATE:
      return {
        ...state,
        loading: true,
      };

    case CREATE_FROM_ITEM_TEMPLATE_SUCCESS:
      return {
        ...state,
        items: [action.payload.item, ...state.items],
        itemTemplates: state.itemTemplates.filter(
          (template) => template.id !== action.payload.template_id,
        ),
        loading: true,
      };

    case CREATE_FROM_ITEM_TEMPLATE_FAILURE:
      return {
        ...state,
        loading: true,
      };

    default:
      return state;
  }
}

export function ItemProvider(props) {
  const [itemState, dispatch] = useReducer(reducer, initialState);

  const fetchItemTemplates = useCallback(() => {
    dispatch({type: FETCH_ITEM_TEMPLATES});
    return api
      .get('/influencer/templates/list')
      .then((response) => response.data)
      .then((resp) => {
        dispatch({type: FETCH_ITEM_TEMPLATES_SUCCESS, payload: resp});
        return resp;
      })
      .catch((err) => {
        dispatch({type: FETCH_ITEM_TEMPLATES_FAILURE, payload: err});
        throw err;
      });
  }, [dispatch]);

  const createFromTemplate = useCallback(
    (template_id) => {
      dispatch({type: CREATE_FROM_ITEM_TEMPLATE});
      return api
        .post('/influencer/templates/create_item', {template_id})
        .then((response) => response.data)
        .then((resp) => {
          dispatch({
            type: CREATE_FROM_ITEM_TEMPLATE_SUCCESS,
            payload: {item: resp, template_id},
          });
          return resp;
        })
        .catch((err) => {
          dispatch({type: CREATE_FROM_ITEM_TEMPLATE_FAILURE, payload: err});
          throw err;
        });
    },
    [dispatch],
  );

  const getInfluencerItems = useCallback(
    (questionData) => {
      dispatch({type: GET_ITEMS});
      return api
        .get('/influencer/items')
        .then((response) => response.data)
        .then((resp) => {
          dispatch({type: GET_ITEMS_SUCCESS, payload: resp});
          return resp;
        })
        .catch((err) => {
          dispatch({type: GET_ITEMS_FAILURE, payload: err});
          throw err;
        });
    },
    [dispatch],
  );

  const getUnslottedItems = useCallback(() => {
    return api.migrate
      .get('/influencer/timeslots/items')
      .then((response) => response.data)
      .then((resp) => {
        dispatch({type: GET_UNSLOTTED_ITEMS, payload: resp});
        return resp;
      })
      .catch((err) => {
        throw err;
      });
  }, [dispatch]);

  const saveInfluencerItem = useCallback(
    (planData) => {
      dispatch({type: ADD_ITEM});
      return api
        .post('/influencer/items/create', planData)
        .then((response) => response.data)
        .then((resp) => {
          dispatch({type: ADD_ITEM_SUCCESS, payload: resp});
          return resp;
        })
        .catch((err) => {
          dispatch({type: ADD_ITEM_FAILURE, payload: err});
          throw err;
        });
    },
    [dispatch],
  );

  const removeInfluencerItem = useCallback(
    (planId) => {
      dispatch({type: REMOVE_ITEM});
      return api
        .delete(`/influencer/items/${planId}`)
        .then((response) => response.data)
        .then((resp) => {
          dispatch({type: REMOVE_ITEM_SUCCESS, payload: resp});
          return resp;
        })
        .catch((err) => {
          dispatch({type: REMOVE_ITEM_FAILURE, payload: err});
          throw err;
        });
    },
    [dispatch],
  );

  const swapInfluencerItems = useCallback(
    (items) => {
      return api
        .post('/influencer/items/swap', items)
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

  const uploadFiles = useCallback(
    (data) => {
      dispatch({type: ADD_FILES});
      return api.migrate
        .post('/influencer/media', data)
        .then((response) => response.data)
        .then((resp) => {
          dispatch({type: ADD_FILES_SUCCESS, payload: resp});
          return resp;
        })
        .catch((err) => {
          dispatch({type: ADD_FILES_FAILURE, payload: err});
          throw err;
        });
    },
    [dispatch],
  );

  const removeFile = useCallback(
    (fileId) => {
      dispatch({type: REMOVE_FILE});
      return api.migrate
        .delete(`/influencer/media/${fileId}`)
        .then((response) => response.data)
        .then((resp) => {
          dispatch({type: REMOVE_FILE_SUCCESS, payload: resp});
          return resp;
        })
        .catch((err) => {
          dispatch({type: REMOVE_FILE_FAILURE, payload: err});
          throw err;
        });
    },
    [dispatch],
  );

  const getFiles = useCallback(() => {
    dispatch({type: GET_FILES});
    return api.migrate
      .get('/influencer/media')
      .then((response) => response.data)
      .then(({files}) => {
        dispatch({type: GET_FILES_SUCCESS, payload: files});
        return files;
      })
      .catch((err) => {
        dispatch({type: GET_FILES_FAILURE, payload: err});
        throw err;
      });
  }, [dispatch]);

  const value = {
    itemState,
    dispatch,
    itemActions: {
      getInfluencerItems,
      getUnslottedItems,
      saveInfluencerItem,
      removeInfluencerItem,
      swapInfluencerItems,
      uploadFiles,
      getFiles,
      removeFile,
      fetchItemTemplates,
      createFromTemplate,
    },
  };

  return (
    <ItemStore.Provider value={value}>{props.children}</ItemStore.Provider>
  );
}
