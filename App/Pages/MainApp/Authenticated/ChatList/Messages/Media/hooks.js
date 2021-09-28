import {useCallback, useContext} from 'react';
import {useRecoilState} from 'recoil';
import {
  __messagesMediaMode__,
  __messagesMediaUploading__,
} from 'State/messages';
import {MessageStore} from 'State/MessageContext';
import {Alert} from 'react-native';
import {useRoute} from '@react-navigation/core';

export const useMediaUploader = () => {
  const [mode, setMode] = useRecoilState(__messagesMediaMode__);

  // use caution, only works under certain routes;
  const route = useRoute();
  // TODO: allow passing these externally
  const {chat_id} = route.params;
  const {actions} = useContext(MessageStore);

  const [isMediaUploading, setIsMediaUploading] = useRecoilState(
    __messagesMediaUploading__,
  );

  const handleMedia = useCallback(
    async (file) => {
      setIsMediaUploading(true);

      const handler = {
        audio: actions.sendAudioMessage,
        video: actions.sendVideoMessage,
      }[mode];

      const file_info = await handler({
        file_uri: file.path,
        size: file.size,
        duration: file.duration,
      });

      try {
        await actions.finishMediaMessage(file_info, chat_id);
      } catch {
        Alert.alert('Could not send the media message. Please try again.');
      }

      setIsMediaUploading(false);
      setMode(null);
    },
    [
      actions.sendAudioMessage,
      actions.sendVideoMessage,
      actions.finishMediaUpload,
      chat_id,
    ],
  );

  const hide = useCallback(() => {
    if (!isMediaUploading) {
      setMode(null);
    }
  });

  return {hide, handleMedia};
};
