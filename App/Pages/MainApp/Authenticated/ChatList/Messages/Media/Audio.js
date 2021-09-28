import React from 'react';
import {useMediaUploader} from 'Pages/MainApp/Authenticated/ChatList/Messages/Media/hooks';
import AudioRecorder from '@/Components/AudioRecorder';

export const AudioChatComponent = () => {
  const {hide, handleMedia} = useMediaUploader();

  return (
    <AudioRecorder
      onRecordingStart={() => {}}
      onDismiss={hide}
      onSend={(val) => {
        handleMedia(val);
        hide();
      }}
    />
  );
};
