import React, {useEffect, useContext} from 'react';
import AuthenticatedPage from './Authenticated/index.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authSubject from 'State/Services/authSubject';
import {AuthStore} from 'State/AuthContext';
import RNRestart from 'react-native-restart';
import {OnboardingStore} from '@/State/OnboardingContext/index.js';
import Loader from './Shared/Loader/index.js';
import CreateItemPage from './Shared/CreateItem/index.js';
import CreateTimeslotPage from './Shared/CreateTimeslot/index.js';
import CreateSocialMediaPage from './Shared/CreateSocialMedia/index.js';
import {createStackNavigator} from '@react-navigation/stack';
import {useNavigation, StackActions} from '@react-navigation/native';
import SocialMediaPage from 'Pages/MainApp/Onboarding/SocialMedia';
import StoryPage from 'Pages/MainApp/Onboarding/Story';
import PendingApplicationPage from 'Pages/MainApp/Onboarding/PendingApplication';
import NumberConfigPage from 'Pages/MainApp/Onboarding/NumberConfig';
import ProfilePicturePage from 'Pages/MainApp/Onboarding/ProfilePicture';
import PurchaseCreditsPage from './Shared/PurchaseCredits';
import InternalBrowserPage from './Shared/InternalBrowser';
import MessagesPage from 'Pages/MainApp/Authenticated/ChatList/Messages/index.js';

const Stack = createStackNavigator();

export const onboardingScreens = [
  {
    key: 'socialMediaPage',
    component: SocialMediaPage,
  },
  {
    key: 'storyPage',
    component: StoryPage,
  },
  {
    key: 'pendingApplicationPage',
    component: PendingApplicationPage,
  },
  {
    key: 'numberConfigPage',
    component: NumberConfigPage,
  },
  {
    key: 'profilePicturePage',
    component: ProfilePicturePage,
  },
];

const Switch = React.memo(() => {
  const navigation = useNavigation();
  const {onboardingState, onboardingActions} = useContext(OnboardingStore);

  const navigate = (page) => {
    const resetAction = StackActions.replace(page);
    navigation.dispatch(resetAction);
  };

  useEffect(() => {
    if (onboardingState.loading || !onboardingState.onboardingStep) {
      return;
    }

    if (onboardingState.hasOnboarded) {
      navigate('authenticatedPage');
      return;
    }

    if (
      onboardingScreens.find(
        (screen) => screen.key === onboardingState.onboardingStep,
      )
    ) {
      navigate(onboardingState.onboardingStep);
    } else {
      if (onboardingState.approved) {
        navigate('numberConfigPage');
      } else {
        navigate('socialMediaPage');
      }
    }
  }, [onboardingState, onboardingActions.editOnboardingInfo]);

  return <Loader />;
});

const MainApp = () => {
  const {authActions} = useContext(AuthStore);
  const {onboardingState, onboardingActions} = useContext(OnboardingStore);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
    });
  }, []);

  useEffect(() => {
    const subscription = authSubject.subscribe(async (payload) => {
      if (payload.type === 'LOGOUT') {
        try {
          await AsyncStorage.removeItem('AUTH_TOKEN');

          await authActions.logoutAction();
          await RNRestart.Restart();
        } catch (err) {}
      }
    });
    return () => subscription.unsubscribe();
  }, [authActions]);

  useEffect(() => {
    onboardingActions.fetchOnboardingInfo();
  }, [onboardingActions.fetchOnboardingInfo]);

  useEffect(() => {
    (async () => {
      const push_token = await AsyncStorage.getItem('PUSH_TOKEN');
      if (push_token) {
        await authActions.pushToken({
          push_token,
        });
      }
    })();
  }, [authActions.pushToken]);

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="loadingPage" component={Switch} />
      {onboardingScreens.map((screen) => (
        <Stack.Screen
          key={screen.key}
          name={screen.key}
          component={screen.component}
        />
      ))}
      <Stack.Screen
        initial={onboardingState.hasOnboarded}
        name="authenticatedPage"
        component={AuthenticatedPage}
      />

      {
        //Shared Screens
      }
      <Stack.Screen
        name="purchaseCreditsPage"
        component={PurchaseCreditsPage}
      />
      <Stack.Screen name="internalBrowser" component={InternalBrowserPage} />
      <Stack.Screen name="createItemPage" component={CreateItemPage} />
      <Stack.Screen name="createTimeslotPage" component={CreateTimeslotPage} />
      <Stack.Screen
        name="createSocialMediaPage"
        component={CreateSocialMediaPage}
      />
      <Stack.Screen name="MessagesPage" component={MessagesPage} />
    </Stack.Navigator>
  );
};

export default MainApp;
