/* eslint-disable react-native/no-inline-styles */
/* eslint-disable max-lines */
/* eslint-disable no-console */
import 'react-native-gesture-handler';
import React, {useContext, useEffect, useMemo, useState} from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {StyleSheet, Text, View, Alert} from 'react-native';
import {COLORS} from 'Styles/colors.js';
import {Badge} from '@/Components/Badge';
import {createStackNavigator} from '@react-navigation/stack';
import ChatListPage from './ChatList';
import DashboardPage from './Dashboard';
import SettingsPage from './Settings';
import CallsPage from './Calls/index.js';
import ProfilePage from './Profile';
import ModifyProfilePage from './Profile/ModifyProfile/index.js';
import ManageSocialMediaPage from './Settings/ManageSocialMedia/index.js';
import CallSchedulingPage from './Settings/CallScheduling/index.js';
import AutoresponderPage from './Settings/Autoresponder/index.js';
import SubscriptionPage from './Settings/Subscription/index.js';
import NotificationsPage from './Settings/Notifications/index.js';
import PaymentSettingsPage from './Settings/PaymentSetting/index.js';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavStore} from '@/State/NavContext/index.js';
import {MessageStore} from 'State/MessageContext';
import {ItemStore} from 'State/ItemContext';
import messaging from '@react-native-firebase/messaging';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import tw from 'tw';
import {Icon} from 'react-native-elements';
import {StackActions} from '@react-navigation/native';
import {ProfileStore} from '@/State/ProfileContext';
import Loader from '../Shared/Loader';
import {SocialMediaStore} from 'State/SocialMediaContext';
import {TimeslotStore} from 'State/TimeslotContext';
import {AuthStore} from 'State/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';
import {OnboardingStore} from '@/State/OnboardingContext/index.js';

const CallStack = createStackNavigator();
const ChatStack = createStackNavigator();
const Settingstack = createStackNavigator();

function CallStackScreen() {
  return (
    <ChatStack.Navigator initialRouteName="CallsPage">
      <CallStack.Screen
        name="CallsPage"
        component={CallsPage}
        options={{headerShown: false}}
      />
    </ChatStack.Navigator>
  );
}

function ChatStackScreen() {
  return (
    <ChatStack.Navigator initialRouteName="ChatListPage">
      <ChatStack.Screen
        name="ChatListPage"
        component={ChatListPage}
        options={{headerShown: false}}
      />
    </ChatStack.Navigator>
  );
}

function ProfileScreen() {
  return (
    <Settingstack.Navigator initialRouteName="ProfilePage">
      <Settingstack.Screen
        name="ProfilePage"
        component={ProfilePage}
        options={{headerShown: false}}
      />
      <Settingstack.Screen
        name="ModifyProfilePage"
        component={ModifyProfilePage}
        options={{headerShown: false}}
      />
    </Settingstack.Navigator>
  );
}

function SettingsScreen() {
  return (
    <Settingstack.Navigator initialRouteName="Settings">
      <Settingstack.Screen
        name="Settings"
        component={SettingsPage}
        options={{headerShown: false}}
      />
      <Settingstack.Screen
        name="CallSchedulingPage"
        component={CallSchedulingPage}
        options={{headerShown: false}}
      />
      <Settingstack.Screen
        name="AutoresponderPage"
        component={AutoresponderPage}
        options={{headerShown: false}}
      />
      <Settingstack.Screen
        name="SubscriptionPage"
        component={SubscriptionPage}
        options={{headerShown: false}}
      />
      <Settingstack.Screen
        name="ManageSocialMediaPage"
        component={ManageSocialMediaPage}
        options={{headerShown: false}}
      />
      <Settingstack.Screen
        name="NotificationsPage"
        component={NotificationsPage}
        options={{headerShown: false}}
      />
      <Settingstack.Screen
        name="PaymentSettingsPage"
        component={PaymentSettingsPage}
        options={{headerShown: false}}
      />
    </Settingstack.Navigator>
  );
}

const Tab = createMaterialBottomTabNavigator();

const wrapper = async (fn, param) => {
  try {
    await Promise.race([
      fn(param),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 3000),
      ),
    ]).catch(function (err) {
      throw err;
    });
  } catch (error) {
    console.error(error);
  }
};

function AuthenticatedPage({navigation}) {
  const {authActions} = useContext(AuthStore);
  const {navState} = useContext(NavStore);
  const {state: messageState, actions: messageActions} = useContext(
    MessageStore,
  );
  const {actions: smActions} = useContext(SocialMediaStore);
  const {actions: timeslotActions} = useContext(TimeslotStore);

  const {itemState, itemActions} = useContext(ItemStore);

  const [remoteData, setRemoteData] = useState({});
  const {state: profileState, actions: profileActions} = useContext(
    ProfileStore,
  );
  const {onboardingState} = useContext(OnboardingStore);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profileState.profile.influencer_id) {
      messageActions.getChats(profileState.profile.influencer_id);
    }
  }, [messageActions.getChats, profileState]);

  useEffect(() => {
    (async () => {
      const {
        influencer_id,
        timezone_name,
      } = await profileActions.fetchProfile();

      if (influencer_id && timezone_name) {
        await wrapper(profileActions.fetchReviews, influencer_id);
        await wrapper(messageActions.getChats, influencer_id);
        await wrapper(itemActions.getInfluencerItems);
        await wrapper(itemActions.getUnslottedItems);
        await wrapper(itemActions.fetchItemTemplates);
        await wrapper(smActions.getSocialMedia, influencer_id);
        await wrapper(timeslotActions.getAppointments, timezone_name);
        await wrapper(timeslotActions.getTimeslots, influencer_id);
      } else {
        Alert.alert('Erorr while fetching data', 'Please log in again.', [
          {
            text: 'OK',
            onPress: () =>
              AsyncStorage.removeItem('AUTH_TOKEN')
                .then(authActions.logoutAction)
                .then(RNRestart.Restart()),
            style: 'cancel',
          },
        ]);
      }
      setLoading(false);
    })();
  }, []);

  const chatList = useMemo(() => {
    return messageState.chats;
  }, [messageState]);

  useEffect(() => {
    if (chatList && chatList.length) {
      const unreadMessages = {
        subscribed: 0,
        registered: 0,
      };
      messageState.chats.forEach((chat) => {
        if (!chat.is_read) {
          unreadMessages[chat.type] = unreadMessages[chat.type] + 1;
        }
      });

      messageActions.setUnreadMessages(unreadMessages);
    }
  }, [chatList]);

  const itemsWithoutSlots = useMemo(
    () => itemState.unslottedItems.filter((i) => !i.timeslots?.length),
    [itemState.unslottedItems],
  );

  useEffect(() => {
    if (chatList.find((chat) => chat.id === remoteData.id)) {
      navigation.dispatch(
        StackActions.push('MessagesPage', {
          chat_id: remoteData.id,
        }),
      );
    }
    setRemoteData(false);
  }, [remoteData, chatList]);

  useEffect(() => {
    let handled = false;
    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      if (remoteMessage) {
        setRemoteData(remoteMessage.data);
        handled = true;
      }
    });

    if (!handled) {
      messaging()
        .getInitialNotification()
        .then(async (remoteMessage) => {
          if (remoteMessage) {
            setRemoteData(remoteMessage.data);
          }
        });
    }
  }, []);

  useEffect(() => {
    if (onboardingState.onboardingStep !== 'authenticatedPage') {
      profileActions.editProfile({onboardingStep: 'authenticatedPage'});
    }
  }, [onboardingState.onboardingStep, profileActions.editProfile]);

  const getInitialRoute = useMemo(() => {
    return onboardingState.onboardingStep === 'authenticatedPage'
      ? 'Messages'
      : 'Profile';
  }, [onboardingState.onboardingStep]);

  return (
    <SafeAreaProvider>
      {loading ? (
        <Loader />
      ) : (
        <Tab.Navigator
          initialRouteName={getInitialRoute}
          inactiveColor={COLORS.darkGray}
          activeColor={COLORS.blue}
          labeled
          barStyle={{
            ...styles.barStyle,
            height: navState.tabBarVisible ? 'auto' : 0,
          }}>
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              tabBarLabel: <Text style={styles.labelText}> Profile </Text>,
              tabBarIcon: ({color}) => (
                <Icon
                  name="user-alt"
                  color={color}
                  type="font-awesome-5"
                  size={wp(5)}
                  solid
                />
              ),
            }}
          />
          <Tab.Screen
            name="Calls"
            component={CallStackScreen}
            options={{
              tabBarLabel: <Text style={styles.labelText}> Meetings </Text>,
              tabBarIcon: ({color}) => (
                <View style={styles.navBtnWrapper}>
                  <View style={styles.unreadContainer}>
                    {itemsWithoutSlots.length ? <Badge number="1" /> : null}
                  </View>
                  <Icon
                    name="user-friends"
                    color={color}
                    type="font-awesome-5"
                    size={wp(5)}
                    solid
                  />
                </View>
              ),
            }}
          />
          <Tab.Screen
            name="Messages"
            component={ChatStackScreen}
            options={{
              tabBarLabel: <Text style={styles.labelText}>Messages</Text>,
              tabBarIcon: ({color}) => (
                <View style={styles.navBtnWrapper}>
                  <View style={styles.unreadContainer}>
                    <Badge
                      number={Object.values(messageState.unreadMessages).reduce(
                        (a, b) => a + b,
                      )}
                    />
                  </View>
                  <Icon
                    name="comments"
                    type="font-awesome-5"
                    color={color}
                    size={wp(5)}
                    solid
                  />
                </View>
              ),
            }}
          />
          <Tab.Screen
            name="Dashboard"
            component={DashboardPage}
            options={{
              tabBarLabel: <Text style={styles.labelText}> Dashboard </Text>,
              tabBarIcon: ({color}) => (
                <Icon
                  name="th"
                  type="font-awesome-5"
                  color={color}
                  size={wp(5)}
                  solid
                />
              ),
            }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              tabBarLabel: <Text style={styles.labelText}> Settings </Text>,
              tabBarIcon: ({color}) => (
                <Icon
                  name="user-cog"
                  color={color}
                  type="font-awesome-5"
                  size={wp(5)}
                  solid
                />
              ),
            }}
          />
        </Tab.Navigator>
      )}
    </SafeAreaProvider>
  );
}

export default AuthenticatedPage;

export const styles = StyleSheet.create({
  labelText: {
    ...tw('text-blue'),
    fontSize: wp(3.6),
  },
  barStyle: {
    backgroundColor: COLORS.white,
    elevation: 0,
    borderTopWidth: 1,
    borderColor: '#E8E8E8',
    paddingVertical: 10,
  },
  unreadContainer: {
    position: 'absolute',
    zIndex: 15,
    right: 10,
    bottom: 10,
  },
  navBtnWrapper: {
    position: 'relative',
  },
});
