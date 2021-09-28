import React, {useContext} from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  StatusBar,
} from 'react-native';
import {Containers, Typography} from 'Styles';
import {APP_URL} from 'State/Constants';
import {AuthStore} from 'State/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';
import {ProfileStore} from 'State/ProfileContext';
import {COLORS} from 'Styles/colors';
import {Icon} from 'react-native-elements';
import {Header} from '@/Components/Layout/Header';
import Intercom from 'react-native-intercom';
import tw from 'tw';

const SettingsPage = ({navigation}) => {
  const {authActions} = useContext(AuthStore);
  const {state} = useContext(ProfileStore);

  const logout = () => {
    AsyncStorage.removeItem('AUTH_TOKEN')
      .then(authActions.logoutAction)
      .then(RNRestart.Restart());
  };

  const goToCallSettings = () => {
    navigation.navigate('CallSchedulingPage', {
      timezone: state.profile.timezone_name,
    });
  };

  const goToAutoresponderSettings = () => {
    navigation.navigate('AutoresponderPage', {
      profile: state.profile,
    });
  };

  const goToSocialMediaSettings = () => {
    navigation.navigate('ManageSocialMediaPage', {
      profile: state.profile,
    });
  };

  const goToNotificationsSettings = () => {
    navigation.navigate('NotificationsPage', {
      profile: state.profile,
    });
  };

  const gotoPaymentSettings = () => {
    navigation.navigate('PaymentSettingsPage');
  };

  const goToHelp = () => {
    Intercom.displayHelpCenter();
  };

  return (
    <>
      <StatusBar translucent backgroundColor="#fff" barStyle="dark-content" />
      <Header hideBack hideDone title="Settings" />

      <View style={Containers.background}>
        <ScrollView>
          {[
            {
              title: 'Scheduling',
              onPress: goToCallSettings,
              color: COLORS.blue,
            },
            {
              title: 'Autoresponder',
              onPress: goToAutoresponderSettings,
              color: COLORS.blue,
            },
            {
              title: 'Social Media Profiles',
              onPress: goToSocialMediaSettings,
              color: COLORS.blue,
            },
            {
              title: 'Notifications',
              onPress: goToNotificationsSettings,
              color: COLORS.blue,
            },
            {
              title: 'Payment',
              onPress: gotoPaymentSettings,
              color: COLORS.blue,
            },
            {
              title: 'Get Help',
              onPress: goToHelp,
              icon: 'info-circle',
              color: COLORS.blue,
            },
            {
              title: 'Logout',
              onPress: logout,
              color: COLORS.red,
              icon: 'times',
            },
          ].map((nav, idx) => (
            <TouchableOpacity
              onPress={nav.onPress}
              key={idx}
              style={styles.navigationContainer}>
              <Text style={[Typography.subtitle, {color: nav.color}]}>
                {nav.title}
              </Text>
              {nav.icon ? (
                <Icon
                  size={16}
                  color={nav.color}
                  type="font-awesome-5"
                  name={nav.icon}
                />
              ) : null}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  navigationContainer: {
    ...Containers.container,
    ...tw('flex-row justify-between items-center py-4'),
  },
});

export default SettingsPage;
