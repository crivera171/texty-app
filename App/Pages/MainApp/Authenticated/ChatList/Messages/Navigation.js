import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useMemo, useContext, useCallback} from 'react';
import {useNavigation, StackActions} from '@react-navigation/native';
import {COLORS} from 'Styles/colors';
import {Icon} from 'react-native-elements';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import tw from 'tw';
import {MessageStore} from 'State/MessageContext';

export const Navigation = ({chatId}) => {
  const navigation = useNavigation();
  const {state} = useContext(MessageStore);

  const chatList = useMemo(() => {
    const currentChat = state.chats.find((chat) => chat.id === chatId);
    return state.chats.filter((chat) => chat.type === currentChat.type);
  }, [state.chats]);

  const getCurrentChatIndex = useMemo(() => {
    if (chatList.length) {
      return chatList.findIndex((chat) => chat.id === chatId);
    }
  }, [chatList]);

  const toNextChat = useCallback(() => {
    navigation.dispatch(
      StackActions.replace('MessagesPage', {
        chat_id: chatList[getCurrentChatIndex + 1].id,
      }),
    );
  }, [getCurrentChatIndex]);

  const toPreviousChat = useCallback(() => {
    navigation.dispatch(
      StackActions.replace('MessagesPage', {
        chat_id: chatList[getCurrentChatIndex - 1].id,
      }),
    );
  }, [getCurrentChatIndex]);

  const isFirst = useMemo(() => getCurrentChatIndex === 0);
  const isLast = useMemo(() => getCurrentChatIndex === chatList.length - 1);

  return (
    <View style={styles.chatNavigationContainer}>
      <TouchableOpacity
        disabled={isFirst}
        style={[styles.chatNavigationButton, tw('justify-start')]}
        transparent
        onPress={() => toPreviousChat()}>
        <Icon
          type="ionicon"
          size={wp(3.4)}
          color={isFirst ? COLORS.gray : COLORS.blue}
          name="ios-arrow-back"
        />
        <Text
          style={[
            styles.chatNavigationText,
            isFirst && styles.chatNavigationInactive,
          ]}>
          Previous Chat
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        disabled={isLast}
        style={[styles.chatNavigationButton, tw('justify-end')]}
        transparent
        onPress={() => toNextChat()}>
        <Text
          style={[
            styles.chatNavigationText,
            isLast && styles.chatNavigationInactive,
          ]}>
          Next Chat
        </Text>
        <Icon
          type="ionicon"
          size={wp(3.4)}
          color={isLast ? COLORS.gray : COLORS.blue}
          name="ios-arrow-forward"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  chatNavigationContainer: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderColor: '#E8E8E8',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  chatNavigationButton: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  chatNavigationText: {
    fontSize: wp(4),
    color: COLORS.blue,
    padding: 10,
  },
  chatNavigationInactive: {
    color: COLORS.gray,
  },
});
