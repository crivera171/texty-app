import {useRecoilState} from 'recoil';
import {__messagesComposerText__} from 'State/messages';
import {TextInput, Platform} from 'react-native';
import React from 'react';
import tw from 'tw';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

export const ComposerField = () => {
  const [text, setText] = useRecoilState(__messagesComposerText__);
  return (
    <TextInput
      style={[
        tw('border border-lighter rounded-2xl px-4 py-2 ml-2 flex-grow'),
        {
          maxWidth: wp(100) - 65,
          ...(Platform.OS === 'android' ? {height: 30, top: 0} : {}),
        },
      ]}
      defaultValue=""
      onChangeText={setText}
      value={text}
    />
  )
};
