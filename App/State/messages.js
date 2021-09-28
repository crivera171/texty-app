import {atom} from 'recoil';

export const __messagesPlayingVideo__ = atom({
  key: '@texty/messages/playingVideo',
  default: '',
});

export const __messagesOrderData__ = atom({
  key: '@texty/messages/orderData',
  default: '',
});

export const __messagesMediaMode__ = atom({
  key: '@texty/messages/mediaMode',
  default: '',
});

export const __messagesMediaUploading__ = atom({
  key: '@texty/messages/isMediaUploading',
  default: false,
});

export const __messagesChatHasOrder__ = atom({
  key: '@texty/messages/chatHasOrder',
  default: false,
});

export const __messagesChatHasOrderPopup__ = atom({
  key: '@texty/messages/chatHasOrderPopup',
  default: false,
});
