import React, {useContext, useCallback, useEffect} from 'react';
import {View, StyleSheet, ScrollView, Text} from 'react-native';
import {Buttons, Containers, Typography} from 'Styles';
import {COLORS} from 'Styles/colors.js';
import {ProfileStore} from 'State/ProfileContext';
import {CopyTextDisplay} from '@/Components/Shared/Data/CopyTextDisplay/index.js';
import {FormButton} from '@/Components/Buttons/Button';
import {events, useTracker} from 'utils/analytics';
import {useNavigation} from '@react-navigation/native';
import {useOnbordingSteps} from 'utils/onboarding';
import {Icon} from 'react-native-elements';

const SignupCompletePage = () => {
  const {navigate} = useNavigation();
  const {state, actions} = useContext(ProfileStore);
  const {track} = useTracker(events.onboarding_complete_screen);
  const {nextStep} = useOnbordingSteps();

  useEffect(() => {
    actions.fetchProfile();
  }, [actions.fetchProfile]);

  const goToApp = useCallback(
    () =>
      actions
        .editProfile({onboardingStep: nextStep, has_onboarded: true})
        .then(() => {
          track(events.onboarding_complete);
          navigate(nextStep);
        }),
    [actions.editProfile],
  );

  return (
    <View style={styles.pageContainer}>
      <View>
        <Icon
          fontSize={98}
          color={COLORS.blue}
          style={styles.icon}
          name="checkmark-circle-outline"
        />
      </View>
      <ScrollView>
        <View style={styles.pageTitleContainer}>
          <Text style={styles.pageTitle}>All set</Text>
        </View>
        <View style={styles.pageSubtitleContainer}>
          <Text style={styles.pageSubTitle}>Your number is</Text>
        </View>
        <View style={styles.pageSubtitleContainer}>
          <CopyTextDisplay
            textStyle={styles.numberTitle}
            iconSize={28}
            formatAsPhone
            text={state.profile.twilio_phone_number}
          />
        </View>
        <View style={styles.finishButtonContainer}>
          <FormButton
            full
            loading={state.loading}
            style={styles.finishButton}
            rounded
            onPress={goToApp}>
            <Text style={styles.finshButtonText}>Finish</Text>
          </FormButton>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    ...Containers.contextContainer,
  },
  checkmarkImageContainer: {
    ...Containers.imageContainer,
  },
  pageTitleContainer: {
    ...Containers.titleContainer,
  },
  pageSubtitleContainer: {
    ...Containers.subtitleContainer,
  },
  finishButtonContainer: {
    ...Containers.itemContainer,
  },
  finishButton: {
    ...Buttons.primaryButton,
    ...Buttons.formButton,
  },
  finshButtonText: {
    ...Buttons.lightButtonText,
  },
  pageTitle: {
    ...Typography.title,
  },
  pageSubTitle: {
    ...Typography.subtitle,
  },
  numberTitle: {
    ...Typography.title,
    color: COLORS.blue,
    textAlign: 'center',
    justifyContent: 'center',
    lineHeight: 70,
  },
  icon: {
    ...Typography.successIcon,
  },
});

export default SignupCompletePage;
