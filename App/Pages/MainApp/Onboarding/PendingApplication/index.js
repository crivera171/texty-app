import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Linking,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {Containers, Typography} from 'Styles';
import {ProfileStore} from 'State/ProfileContext';
import {useTracker, events} from 'utils/analytics';
import {useNavigation} from '@react-navigation/native';
import {useOnbordingSteps} from 'utils/onboarding';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Icon} from 'react-native-elements';
import {COLORS} from 'Styles/colors.js';
import tw from 'tw';

const PendingApplicationPage = () => {
  const {nextStep} = useOnbordingSteps();
  const {state, actions} = useContext(ProfileStore);
  const [interval, setIntervalPointer] = useState(null);
  useTracker(events.onboarding_pending_verification);
  const {navigate} = useNavigation();

  useEffect(() => {
    if (interval) {
      clearInterval(interval);
    }
    actions.fetchProfile();
    setIntervalPointer(
      setInterval(() => {
        actions.fetchProfile();
      }, 5000),
    );
    return () => clearInterval(interval);
  }, [actions.fetchProfile]);

  useEffect(() => {
    if (state.profile.approved) {
      actions
        .editProfile({onboardingStep: nextStep, has_onboarded: false})
        .then(() => {
          clearInterval(interval);
          navigate(nextStep);
        });
    }
  }, [state.profile.approved, actions.editProfile]);

  return (
    <SafeAreaView style={Containers.safeAreaContainer}>
      <View style={styles.pageContainer}>
        <TouchableOpacity
          onPress={async () => await Linking.openURL('sms:2406983989')}
          style={tw('flex-col items-center justify-center h-full')}>
          <Icon
            type="font-awesome-5"
            name="check-circle"
            color={COLORS.blue}
            size={wp(20)}
            style={tw('mb-3')}
            solid
          />
          <Text style={[styles.pageTitle, tw('text-black my-3')]}>Thanks!</Text>
          <Text style={[styles.pageSubtitle, {paddingHorizontal: wp(2)}]}>
            To get your new Texty account approved, please text{' '}
            <Text style={tw('text-blue')}>#approveme</Text> to this number now:
          </Text>
          <Text
            style={[
              styles.pageTitle,
              tw('text-blue mt-3'),
              {fontSize: wp(6.8)},
            ]}>
            (240) 698-3989
          </Text>
          <Text style={[styles.pageSubtitle, tw('mt-8')]}>
            One of our team members will review your information and get back to
            you ASAP.
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    ...tw('h-full bg-white'),
    paddingHorizontal: wp(7),
    paddingBottom: hp(20),
  },
  pageTitle: {
    ...Typography.title,
    fontSize: wp(8),
  },
  pageSubtitle: {
    ...Typography.subtitle,
    fontSize: wp(4.5),
    ...tw('text-center'),
  },
  signupImageContainer: {
    ...Containers.logoContainer,
  },
});

export default PendingApplicationPage;
