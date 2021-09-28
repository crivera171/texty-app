/* eslint max-lines: 0 */ // --> OFF
import React, {createContext, useCallback, useReducer} from 'react';
import {Platform} from 'react-native';
import {
  SET_UNREAD_MESSAGES,
  CREATE_MESSAGE,
  CREATE_MESSAGE_SUCCESS,
  CREATE_MESSAGE_FAILURE,
  CREATE_MEDIA_MESSAGE,
  CREATE_MEDIA_MESSAGE_SUCCESS,
  GET_MESSAGE,
  GET_MESSAGE_SUCCESS,
  GET_MESSAGE_FAILURE,
  GET_CHATS,
  GET_CHATS_SUCCESS,
  GET_CHATS_FAILURE,
  CREATE_MASS_MESSAGE,
  CREATE_MASS_MESSAGE_SUCCESS,
  CREATE_MASS_MESSAGE_FAILURE,
  ADD_MESSAGE,
} from './actions';
import {api} from '@/State/Services/api.js';
import Config from 'react-native-config';
import {MediaService} from '@/State/Services/media.js';
import firestore from '@react-native-firebase/firestore';

export const MessageStore = createContext();

const initialState = {
  loading: false,
  messages: {}, // { 'contact_id' : Record<message_id, message> }
  unreadMessages: {
    subscribed: 0,
    registered: 0,
  },
  chats: [],
  unregisteredChats: [],
  registeredChats: [],
  subscriberChats: [],
};

function reducer(state, action) {
  switch (action.type) {
    case SET_UNREAD_MESSAGES:
      return {
        ...state,
        unreadMessages: action.payload.unreadMessages,
      };
    case CREATE_MESSAGE:
      return {
        ...state,
        loading: true,
      };

    case ADD_MESSAGE:
      return state;
    // TODO:
    // {
    //   ...state,
    //   messages: {
    //     [action.payload.chat_id]: {
    //       ...(state.messages || {})[action.payload.chat_id],
    //       [action.payload.message.id]: action.payload.message,
    //     },
    //   },
    // };

    case CREATE_MESSAGE_SUCCESS:
      return {
        ...state,
        loading: false,
        messages: {
          [action.payload.chat_id]: {
            ...(state.messages || {})[action.payload.chat_id],
            [action.payload.message.id]: action.payload.message,
          },
        },
      };

    case CREATE_MESSAGE_FAILURE:
      return {
        ...state,
        loading: false,
      };

    case CREATE_MEDIA_MESSAGE_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case CREATE_MEDIA_MESSAGE:
      return {
        ...state,
        loading: false,
      };

    case GET_MESSAGE:
      return {
        ...state,
        loading: true,
      };

    case GET_MESSAGE_SUCCESS:
      return {
        ...state,
        loading: false,
        messages: {
          ...state.messages,
          [action.payload.chat_id]: action.payload.messages,
        },
      };

    case GET_MESSAGE_FAILURE:
      return {
        ...state,
        loading: false,
      };

    case GET_CHATS:
      return {
        ...state,
        loading: true,
      };

    case GET_CHATS_SUCCESS:
      return {
        ...state,
        loading: false,
        chats: action.payload.chats,
        unregisteredChats: action.payload.unregisteredChats,
        registeredChats: action.payload.registeredChats,
        subscriberChats: action.payload.subscriberChats,
      };

    case GET_CHATS_FAILURE:
      return {
        ...state,
        loading: false,
      };

    case CREATE_MASS_MESSAGE:
      return {
        ...state,
        loading: true,
      };

    case CREATE_MASS_MESSAGE_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case CREATE_MASS_MESSAGE_FAILURE:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
}

export function MessageProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const sendMessage = useCallback(
    (message) => {
      dispatch({type: CREATE_MESSAGE});
      const {text, contact_id, chatId: chat_id} = message;
      return api.migrate
        .post('/influencer/chats/send', {
          text,
          chat_id,
          contact_id,
        })
        .then((response) => response.data)
        .then((resp) => {
          dispatch({
            type: CREATE_MESSAGE_SUCCESS,
            payload: {message: resp, chat_id},
          });
          return resp;
        })
        .catch((err) => {
          dispatch({type: CREATE_MESSAGE_FAILURE, payload: err});
          throw err;
        });
    },
    [dispatch],
  );

  const addMessage = useCallback(
    (message) => {
      dispatch({
        type: ADD_MESSAGE,
        payload: {message, chat_id: message.chat_id},
      });
    },
    [dispatch],
  );

  const sendAudioMessage = useCallback(
    ({file_uri, size, duration}) => {
      dispatch({type: CREATE_MEDIA_MESSAGE});
      return api
        .post('/media/create', {
          file: file_uri,
          media_type: 'audio',
          file_size: size,
          media_duration: duration,
        })
        .then((response) => response.data)
        .then(({data: r}) => {
          return MediaService.upload(
            r,
            file_uri,
            Config.AUDIO_BUCKET,
            'm4a',
            'video/mp4',
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

  const sendVideoMessage = useCallback(
    ({file_uri, size, duration}) => {
      dispatch({type: CREATE_MEDIA_MESSAGE});
      return api
        .post('/media/create', {
          file: file_uri,
          media_type: 'video',
          file_size: size,
          media_duration: duration,
        })
        .then((response) => response.data)
        .then(({data: r}) => {
          const service =
            Platform.OS === 'android'
              ? MediaService.chunkedUpload
              : MediaService.uploadVideo;
          return service(r, file_uri, 'mp4', 'video/mp4', true)
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

  const finishMediaMessage = useCallback(
    (file_info, chat_id, mass_message) => {
      return api
        .post(`/influencer/chats/${chat_id}/send_media_message`, {
          info: file_info,
          chat_id,
          mass_message,
        })
        .then((resp) => {
          dispatch({
            type: CREATE_MEDIA_MESSAGE_SUCCESS,
            payload: {
              resp,
            },
          });
        });
    },
    [dispatch],
  );

  const getMessages = useCallback(
    (chat_id) => {
      dispatch({type: GET_MESSAGE});
      return firestore()
        .collection(Config.FIRESTORE_CHATS_COLLECTION)
        .doc(chat_id.toString())
        .collection('messages')
        .onSnapshot(
          (querySnapshot) => {
            const messages = [];
            querySnapshot.forEach((documentSnapshot) => {
              const mess = documentSnapshot.data();
              mess.timestamp = Number(new Date(mess.created_at));
              messages.push(mess);
            });
            dispatch({
              type: GET_MESSAGE_SUCCESS,
              payload: {
                messages,
                chat_id,
              },
            });
          },
          (error) => {
            dispatch({type: GET_MESSAGE_FAILURE, payload: error});
            throw error;
          },
        );
    },
    [dispatch],
  );

  const closeOrder = useCallback((order_id) => {
    return api
      .post('/order/close', {id: order_id})
      .then(() => {
        return;
      })
      .catch((err) => {
        throw err;
      });
  });

  const refundOrder = useCallback((order_id) => {
    return api
      .post(`/influencer/order/${order_id}/refund`)
      .then(() => {
        return;
      })
      .catch((err) => {
        throw err;
      });
  });

  const getChats = useCallback(
    (influencer_id) => {
      const sortChatByNewness = (chatA, chatB) => {
        const lastMessACreatedAt = new Date(chatA.last_message?.created_at);
        const lastMessBCreatedAt = new Date(chatB.last_message?.created_at);
        return Number(lastMessBCreatedAt) - Number(lastMessACreatedAt);
      };
      dispatch({type: GET_CHATS});
      firestore()
        .collection(Config.FIRESTORE_CHATS_COLLECTION)
        .where('influencer_id', '==', influencer_id.toString())
        .onSnapshot(
          (querySnapshot) => {
            const chatWithOrders = [];
            const chatWithoutOrders = [];
            querySnapshot.forEach((documentSnapshot) => {
              const chat = documentSnapshot.data();
              if (!chat.contact || !chat.contact_user) {
                return;
              }
              if (chat.order) {
                chatWithOrders.push(chat);
              } else {
                chatWithoutOrders.push(chat);
              }
            });
            const chats = [
              ...chatWithOrders.sort(sortChatByNewness),
              ...chatWithoutOrders.sort(sortChatByNewness),
            ];

            dispatch({
              type: GET_CHATS_SUCCESS,
              payload: {
                chats,
                unregisteredChats: chats.filter(
                  (chat) => chat.type === 'unregistered' && chat.last_message,
                ),
                registeredChats: chats.filter(
                  (chat) => chat.type === 'registered' && chat.last_message,
                ),
                subscriberChats: chats.filter(
                  (chat) => chat.type === 'subscribed' && chat.last_message,
                ),
              },
            });
          },
          (error) => {
            dispatch({type: GET_CHATS_FAILURE, payload: error});
            throw error;
          },
        );
    },
    [dispatch],
  );

  const sendMassMessage = useCallback(
    (messageData) => {
      dispatch({type: CREATE_MASS_MESSAGE});
      return api.migrate
        .post('/influencer/chats/sendMassMessage', messageData)
        .then((response) => response.data)
        .then((resp) => {
          dispatch({
            type: CREATE_MASS_MESSAGE_SUCCESS,
            payload: {text: resp},
          });
          return resp;
        })
        .catch((err) => {
          dispatch({type: CREATE_MASS_MESSAGE_FAILURE, payload: err});
          throw err;
        });
    },
    [dispatch],
  );

  const setUnreadMessages = useCallback(
    (unreadMessages) => {
      dispatch({
        type: SET_UNREAD_MESSAGES,
        payload: {
          unreadMessages,
        },
      });
    },
    [dispatch],
  );

  const setReadChat = useCallback((chat_id) => {
    return api.migrate
      .post(`/influencer/chats/${chat_id}/set_read`)
      .then(({data}) => {
        return data;
      })
      .catch((err) => {
        throw err;
      });
  });

  const value = {
    state,
    dispatch,
    actions: {
      addMessage,
      sendMessage,
      sendAudioMessage,
      sendVideoMessage,
      finishMediaMessage,
      getMessages,
      getChats,
      sendMassMessage,
      closeOrder,
      refundOrder,
      setUnreadMessages,
      setReadChat,
    },
  };

  return (
    <MessageStore.Provider value={value}>
      {props.children}
    </MessageStore.Provider>
  );
}
