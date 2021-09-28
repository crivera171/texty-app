/* eslint-disable react-native/no-inline-styles */
import {Actions as BaseActions} from 'react-native-gifted-chat';
import {Platform} from 'react-native';
import {COLORS} from 'Styles/colors';
import React from 'react';
import {__messagesMediaMode__} from 'State/messages';
import {useSetRecoilState} from 'recoil';
import {Icon} from 'react-native-elements';

export const Actions = (props) => {
  const setMediaMode = useSetRecoilState(__messagesMediaMode__);

  return (
    <BaseActions
      {...props}
      containerStyle={{
        height: 35,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
      }}
      options={{
        ['Send Audio']: () => setMediaMode('audio'),
        ['Send Video']: () => setMediaMode('video'),
        ['Cancel']: () => {},
      }}
      icon={() => (
        <Icon
          type="ionicon"
          name={'attach-outline'}
          size={Platform.OS === 'android' ? 32 : 24}
          color={COLORS.blue}
          style={{
            textAlign: 'right',
            paddingTop: 10,
          }}
        />
      )}
    />
  );
};
