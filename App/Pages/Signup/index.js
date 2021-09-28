import React, {useContext, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  Alert,
  View,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {SignupForm} from 'Components/Shared/Forms/Signup/index.js';
import {AuthStore} from 'State/AuthContext';
import {ProfileStore} from 'State/ProfileContext';
import {useTracker, events} from 'utils/analytics';
import {useNavigation} from '@react-navigation/native';
import * as RNLocalize from 'react-native-localize';
import {Header} from '@/Components/Layout/Header';
import Logo from 'Assets/Images/logo.png';
import tw from 'tw';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {COLORS} from '@/Styles/colors.js';

const SignupPage = () => {
  const {navigate} = useNavigation();
  const {authActions} = useContext(AuthStore);
  const {state, actions} = useContext(ProfileStore);
  const {track} = useTracker(events.onboarding_start_signup);

  useEffect(() => {
    authActions?.logoutAction();
  }, []);

  const onFormSubmit = useCallback(
    ({name, email, phone, password, slug}) =>
      actions
        .createProfile({name, email, phone, password, slug})
        .then(() => {
          actions
            .editProfile({
              timezone_name: RNLocalize.getTimeZone(),
            })
            .then(() => {
              navigate('mainApp');
            });
        })
        .catch((err) => {
          Alert.alert(
            'Error signing up',
            'Please make sure that your phone number / email are not in use',
          );
          track(events.onboarding_signup_error);
          throw err;
        }),
    [actions.createProfile],
  );

  return (
    <SafeAreaView style={tw('bg-white h-full')}>
      <StatusBar translucent backgroundColor={COLORS.white} />
      <Header
        handleBack={() => navigate('welcome')}
        hideDone
        renderTitle={<Image style={styles.logo} source={Logo} />}
      />
      <View style={tw('flex-1')}>
        <SignupForm loading={state.loading} onFormSubmit={onFormSubmit} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: wp(8),
    height: wp(8),
  },
});

export default SignupPage;
