import React, {useContext, useEffect} from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import {MessageStore} from 'State/MessageContext';
import {Media} from './Media';
import {Chat} from 'Pages/MainApp/Authenticated/ChatList/Messages/Chat';
import {Navigation} from 'Pages/MainApp/Authenticated/ChatList/Messages/Navigation';
import {TitleBar} from 'Pages/MainApp/Authenticated/ChatList/Messages/TitleBar';
import tw from 'tw';

const MessagesPage = ({route, navigation}) => {
  const {actions} = useContext(MessageStore);
  const {chat_id} = route.params;

  useEffect(() => {
    if (chat_id != null) {
      return actions.getMessages(chat_id);
    }
  }, [chat_id]);

  return (
    <SafeAreaView style={styles.messagesPageWrapper}>
      <TitleBar chatId={chat_id} />
      <Navigation chatId={chat_id} />

      <Chat chatId={chat_id} />

      <Media />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  messagesPageWrapper: tw('flex-1 bg-white'),
});

export default MessagesPage;
