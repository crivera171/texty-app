/* eslint-disable max-lines */
import React from 'react';
import {
  Alert,
  Keyboard,
  Linking,
  Platform,
  StyleSheet,
  Text,
  BackHandler,
  View,
  ActivityIndicator,
} from 'react-native';
import {Bubble} from 'Pages/MainApp/Authenticated/ChatList/Messages/Chat/Bubble';
import {ChatImage} from 'Pages/MainApp/Authenticated/ChatList/Messages/Chat/ChatImage';
import {ChatVideo} from '@/Pages/MainApp/Authenticated/ChatList/Messages/Chat/ChatVideo';
import {ChatAudio} from '@/Pages/MainApp/Authenticated/ChatList/Messages/Chat/ChatAudio';
import {ChatFile} from '@/Pages/MainApp/Authenticated/ChatList/Messages/Chat/ChatFile';
import {Composer, GiftedChat, InputToolbar} from 'react-native-gifted-chat';
import {Send} from 'Pages/MainApp/Authenticated/ChatList/Messages/Chat/Send';
import {Actions} from 'Pages/MainApp/Authenticated/ChatList/Messages/Chat/Actions';
import {useCallback, useContext, useMemo, useEffect, useState} from 'react';
import {MessageStore} from 'State/MessageContext';
import {ProfileStore} from 'State/ProfileContext';
import {COLORS} from 'Styles/colors';
import {Typography} from '@/Styles';
import {useNavigation} from '@react-navigation/native';
import {OrderPopup} from 'Pages/MainApp/Authenticated/ChatList/Messages/OrderPopup';
import tw from 'tw';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

export const Chat = ({chatId}) => {
  const {state: messageState, actions} = useContext(MessageStore);
  const {state: profileState} = useContext(ProfileStore);
  const navigation = useNavigation();
  const [isOrderShown, setIsOrderShown] = useState(true);

  useEffect(() => {
    const backAction = () => {
      setIsOrderShown(true);
      navigation.navigate('ChatListPage');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const showAlert = () =>
    Alert.alert(
      'Not enough credits',
      "You don't have enough credits to send your message. Pelase buy more credits.",
      [
        {
          text: 'Buy more credits',
          onPress: () => navigation.navigate('purchaseCreditsPage'),
          style: 'default',
        },
        {
          cancelable: true,
          text: 'Cancel',
          style: 'default',
        },
      ],
    );

  const onSend = useCallback(
    ([{text}]) => {
      actions.sendMessage({chatId, text}).catch(() => {
        showAlert();
      });
      Keyboard.dismiss();
    },
    [actions.sendMessage],
  );

  const openChatLink = useCallback(async (link) => {
    const supported = await Linking.canOpenURL(link);
    if (supported) {
      await Linking.openURL(link);
    } else {
      Alert.alert(`Don't know how to open this URL: ${link}`);
    }
  });

  useEffect(() => {
    if (!isRead) {
      actions.setReadChat(chatId);
    }
  }, [isRead]);

  const chat = useMemo(() => {
    return messageState.chats.find(({id}) => id === chatId);
  }, [messageState, chatId]);

  const isRead = useMemo(() => {
    return chat.is_read;
  }, [chat]);

  const order = useMemo(() => {
    return chat.order;
  }, [chat]);

  const notAllowedSendErr = useMemo(() => {
    const messages = [];
    if (chat.is_banned) {
      messages.push('This fan is banned and cannot send or receive messages');
    }
    if (chat.opt_out) {
      messages.push('This fan has unsubscribed from messages');
    }
    return messages.join('\n');
  }, [chat]);

  const chatMessages = useMemo(() => {
    return Object.values(messageState.messages[chatId] || {})
      .sort((a, b) => a.id - b.id)
      .reverse();
  }, [messageState.messages, chatId]);

  const influencer = {
    id: profileState.profile.id,
  };

  const extractMedia = (text) => {
    let links = text.match(
      /(\b(https?|ftp|file):\/\/(media.mytexty.com|media2.mytexty.com|texty-fan-media).[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi,
    );

    if (!links?.length) {
      // look up local links
      links = text.match(
        /(\b(ftp|file):\/\/(.+).[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi,
      );
    }

    const mediaObject = {text};
    const mediaToken = links ? links[0] : null;
    if (!mediaToken) {
      return mediaObject;
    }
    const lookups = [
      {type: 'image', regex: /\.(gif|jpe?g|png)$/i},
      {type: 'video', regex: /\.(mp4)$/i},
      {type: 'video', regex: /\.(mov)$/i},
      {type: 'audio', regex: /\.(m4a)$/i},
      {type: 'file', regex: /./i},
    ];
    for (const lookup of lookups) {
      if (mediaToken.match(lookup.regex)) {
        mediaObject[lookup.type] = mediaToken;
        mediaObject.text = text.replace(links[0], '');
        return mediaObject;
      }
    }
  };

  const formattedMessages = useMemo(() => {
    return chatMessages
      .filter((item) => item.timestamp)
      .map(({text, direction, timestamp, pending}) => ({
        user: {
          _id: direction !== 'from_influencer' ? -1 : influencer.id,
        },
        _id: timestamp,
        ...extractMedia(text),
        createdAt: new Date(timestamp),
        pending: pending ? true : false,
      }))
      .sort((a, b) => b._id - a._id);
  }, [chatMessages]);

  return (
    <View style={styles.chatContainer} accessible accessibilityLabel="main">
      {order ? <OrderPopup order={order} isOrderShown={isOrderShown} /> : null}

      <GiftedChat
        send
        messages={formattedMessages}
        onSend={onSend}
        name="message"
        showUserAvatar={false}
        renderAvatar={null}
        user={{
          _id: influencer.id,
          chatId,
        }}
        timeTextStyle={{left: styles.timeText, right: styles.timeText}}
        parsePatterns={() => [
          {
            type: 'url',
            style: styles.chatUrlToken,
            onPress: openChatLink,
          },
        ]}
        listViewProps={{
          style: {
            marginBottom: Platform.OS === 'ios' ? 0 : 30,
          },
        }}
        renderLoading={() => (
          <View style={tw('flex-1 items-center justify-end pb-12')}>
            <ActivityIndicator size="large" color={COLORS.blue} />
          </View>
        )}
        renderCustomView={ChatFile}
        renderMessageImage={ChatImage}
        renderMessageVideo={(props) => <ChatVideo {...props} />}
        renderMessageAudio={(props) => <ChatAudio {...props} />}
        renderBubble={Bubble}
        renderComposer={(props) => {
          return (
            <Composer
              {...props}
              textInputStyle={styles.inputStyle}
              placeholder="Message"
            />
          );
        }}
        isKeyboardInternallyHandled={false}
        renderInputToolbar={(props) => {
          return (
            <>
              {notAllowedSendErr ? (
                <Text
                  style={{
                    ...Typography.dangerText,
                    ...Typography.textCenter,
                  }}>
                  {notAllowedSendErr}
                </Text>
              ) : (
                <InputToolbar {...props} containerStyle={styles.inputWrapper} />
              )}
            </>
          );
        }}
        minInputToolbarHeight={50}
        renderSend={(props) => <Send {...props} />}
        renderActions={(props) => <Actions {...props} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chatContainer: tw('flex-grow flex-1'),
  inputStyle: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  inputWrapper: {
    ...tw('border-gray mb-2'),
    paddingRight: wp(2),
    borderTopWidth: 1,
  },
  chatUrlToken: {
    color: COLORS.blue,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: COLORS.blue,
  },
  timeText: {fontSize: 14, color: COLORS.darkGray, paddingTop: 5},
  orderInputShown: {},
  orderInputHidden:
    Platform.OS === 'ios' ? {paddingTop: 30, paddingBottom: 30} : {},
});
