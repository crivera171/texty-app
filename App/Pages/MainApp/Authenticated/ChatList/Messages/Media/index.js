import React from 'react';
import {__messagesMediaMode__} from 'State/messages';
import {useRecoilValue} from 'recoil';
import {AudioChatComponent} from './Audio';
import {VideoChatComponent} from './Video';

const resolvers = {
  audio: AudioChatComponent,
  video: VideoChatComponent,
};

export const Media = () => {
  const mode = useRecoilValue(__messagesMediaMode__);

  if (!mode) {
    return null;
  }
  const Resolver = resolvers[mode];
  return Resolver ? <Resolver /> : null;
};
