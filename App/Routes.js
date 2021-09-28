import React, {useEffect} from 'react';
import {
  NavigationContainer,
  useNavigation,
  StackActions,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginPage from './Pages/Login/index.js';
import SignupPage from './Pages/Signup/index.js';
import TutorialPage from './Pages/Tutorial/index.js';
import MainApp from './Pages/MainApp/index.js';
import WelcomePage from './Pages/Welcome/index.js';
import Loader from './Pages/MainApp/Shared/Loader/index.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

const Switch = () => {
  const navigation = useNavigation();

  const navigate = (page) => {
    const resetAction = StackActions.replace(page);
    navigation.dispatch(resetAction);
  };

  const determineAuthState = async () => {
    const tutorialToken = await AsyncStorage.getItem('TUTORIAL_COMPLETE');
    const authToken = await AsyncStorage.getItem('AUTH_TOKEN');

    if (!tutorialToken) {
      navigate('tutorialPage');
    } else if (!authToken) {
      navigate('welcome');
    } else {
      navigate('mainApp');
    }
  };

  useEffect(() => {
    determineAuthState();
  }, []);

  return <Loader />;
};

const Routes = () => (
  <NavigationContainer>
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="loader" component={Switch} />
      <Stack.Screen name="welcome" component={WelcomePage} />
      <Stack.Screen name="login" component={LoginPage} />
      <Stack.Screen name="signup" component={SignupPage} />
      <Stack.Screen name="tutorialPage" component={TutorialPage} />
      <Stack.Screen name="mainApp" component={MainApp} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default Routes;
