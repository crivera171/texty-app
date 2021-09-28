import React, {useContext, useState, useMemo, useCallback} from 'react';
import {Text, Dimensions, View, ScrollView, StatusBar} from 'react-native';
import {Containers, Tabs, Typography} from 'Styles';
import {COLORS} from 'Styles/colors';
import {MessageStore} from 'State/MessageContext';
import {ChatListComponent} from '@/Pages/MainApp/Authenticated/ChatList/ChatListComponent';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {useNavigation, StackActions} from '@react-navigation/native';
import {Badge} from '@/Components/Badge';
import {Header} from '@/Components/Layout/Header';
import MassMessage from './MassMessage';

const initialLayout = {width: Dimensions.get('window').width};

const routes = [
  {key: 'subscribed', title: 'Customers'},
  {key: 'registered', title: 'Fans'},
  {key: 'massMessage', title: 'Mass Message'},
];

const MessagesRoute = React.memo(({chats}) => {
  const navigation = useNavigation();

  const toMessages = useCallback((chatId) => {
    navigation.dispatch(
      StackActions.push('MessagesPage', {
        chat_id: chatId,
      }),
    );
  });

  return (
    <>
      <StatusBar translucent backgroundColor="#fff" barStyle="dark-content" />
      <View style={Containers.background}>
        <ScrollView>
          <View>
            {chats.map((chat, idx) => (
              <ChatListComponent
                chat={chat}
                toMessages={() => toMessages(chat.id)}
                key={idx}
                isRead={chat.is_read}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </>
  );
});

const ChatListPage = () => {
  const [index, setIndex] = useState(0);
  const {state: messageState} = useContext(MessageStore);

  const massMessageRoute = useMemo(() => {
    return MassMessage;
  });

  const renderScene = SceneMap({
    registered: () => <MessagesRoute chats={messageState.registeredChats} />,
    unregistered: () => (
      <MessagesRoute chats={messageState.unregisteredChats} />
    ),
    subscribed: () => <MessagesRoute chats={messageState.subscriberChats} />,
    massMessage: massMessageRoute,
  });

  return (
    <>
      <Header hideBack hideDone title={routes[index].title} />

      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            renderLabel={(labelProps) => (
              <View style={Tabs.notice}>
                <Text style={[Typography.notice, {color: labelProps.color}]}>
                  {labelProps.route.title}
                </Text>
                <Badge
                  number={messageState.unreadMessages[labelProps.route.key]}
                />
              </View>
            )}
            indicatorStyle={Tabs.indicatorStyle}
            style={Tabs.tabBar}
            activeColor={COLORS.blue}
            inactiveColor={COLORS.black}
            labelStyle={Tabs.labelStyle}
          />
        )}
      />
    </>
  );
};

export default ChatListPage;
