import {COLORS} from 'Styles/colors';
import {ActivityIndicator} from 'react-native';
import {Send as BaseSend} from 'react-native-gifted-chat';
import React from 'react';
import {Icon} from 'react-native-elements';
import {useRecoilState} from 'recoil';
import {__messagesMediaUploading__} from 'State/messages';
import tw from 'tw';
export const Send = (props) => {
  const [isMediaUploading] = useRecoilState(__messagesMediaUploading__);

  return (
    <>
      {isMediaUploading ? (
        <ActivityIndicator style={tw('ml-2 mb-3')} color={COLORS.blue} />
      ) : (
        <BaseSend
          {...props}
          containerStyle={tw('ml-2 items-center justify-center')}>
          <Icon
            type="ionicon"
            color={COLORS.blue}
            size={24}
            name="send-outline"
          />
        </BaseSend>
      )}
    </>
  );
};
