import React, {useCallback, useContext, useEffect} from 'react';
import {
  View,
  Image,
  StyleSheet,
  StatusBar,
  Alert,
  Text,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Logo from 'Assets/Images/logo.png';
import {Buttons, Containers, Typography} from 'Styles';
import {LoginForm} from 'Components/Shared/Forms/Login/index.js';
import {AuthStore} from 'State/AuthContext';
import {useNavigation} from '@react-navigation/native';
import {APP_ENV} from 'State/Constants';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {Header} from '@/Components/Layout/Header';
import tw from 'tw';
import {COLORS} from '@/Styles/colors.js';

const LoginPage = () => {
  const {state, authActions} = useContext(AuthStore);
  const {navigate} = useNavigation();
  const loginAttempt = useCallback(
    ({email, password}) => {
      authActions.loginAction({email, password}).catch((e) => {
        Alert.alert(
          'Invalid credentials',
          'Your username or password is incorrect. Please try again.',
        );
      });
    },
    [authActions.loginAction],
  );
  const logginIn = !!state.user;
  useEffect(() => {
    if (logginIn) {
      navigate('mainApp');
    }
  }, [logginIn, navigate]);

  return (
    <SafeAreaView style={tw('bg-white flex-1')}>
      <StatusBar translucent backgroundColor={COLORS.white} />
      <Header
        handleBack={() => navigate('welcome')}
        hideDone
        renderTitle={<Image style={styles.logo} source={Logo} />}
      />
      <ScrollView contentContainerStyle={tw('flex-1')}>
        {APP_ENV === 'dev' && (
          <View style={styles.devContainer}>
            <Text style={styles.devText}>DEVELOPMENT BUILD</Text>
          </View>
        )}
        <LoginForm loading={state.loading} onFormSubmit={loginAttempt} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: wp(8),
    height: wp(8),
  },
  pageContainer: {
    ...Containers.signupContainer,
    height: '100%',
  },
  pageTitleContainer: {
    ...Containers.titleContainer,
  },
  pageSubtitleContainer: {
    ...Containers.subtitleContainer,
  },
  buttonContainer: {
    ...Containers.itemContainer,
    marginTop: 0,
  },
  pageTitle: {
    ...Typography.cardTitle,
    ...tw('text-left mb-2'),
  },
  pageSubtitle: {
    ...Typography.subtitle,
  },
  signupButtontext: {
    ...Typography.subtitle,
    ...Buttons.transparentButtonText,
  },
  devContainer: {
    marginBottom: 5,
    marginTop: 5,
  },
  devText: {
    textAlign: 'center',
    color: 'red',
    paddingBottom: 5,
  },
});
export default LoginPage;
