import React, {useCallback, useContext, useEffect} from 'react';
import {View, ScrollView, StyleSheet, SafeAreaView, Text} from 'react-native';
import {Containers, Typography, Buttons} from '../../../../Styles';
import {ProfileStore} from 'State/ProfileContext';
import {ProfileVideoForm} from '@/Components/Shared/Forms/ProfileVideo/index.js';
import {FormButton} from '@/Components/Buttons/Button';
import {COLORS} from 'Styles/colors.js';
import {events, useTracker} from 'utils/analytics';
import {useNavigation} from '@react-navigation/native';
import {useOnbordingSteps} from 'utils/onboarding';
import {OnboardingStore} from 'State/OnboardingContext';
import tw from 'tw';

const ProfilePicturePage = () => {
  const {nextStep} = useOnbordingSteps();
  const {state, actions} = useContext(ProfileStore);
  const {onboardingActions} = useContext(OnboardingStore);

  const {navigate} = useNavigation();

  useTracker(events.onboarding_photo);

  const influencer = state.profile;

  useEffect(() => {
    actions.fetchProfile();
  }, [actions.fetchProfile]);

  const imageSubmit = useCallback(
    ({profile_video_url}) =>
      actions.editProfile({
        profile_video_url,
      }),
    [actions.editProfile],
  );

  const goToApp = useCallback(
    () =>
      actions.editProfile({has_onboarded: true}).then(() => {
        onboardingActions.complete();
        navigate(nextStep);
      }),
    [actions.editProfile],
  );

  return (
    <SafeAreaView style={Containers.safeAreaContainer}>
      <ScrollView contentContainerStyle={styles.formContainer}>
        <View style={tw('flex-1 flex-col items-center justify-center h-full')}>
          <View style={tw('py-4')}>
            <View style={styles.pageTitleContainer}>
              <Text style={styles.pageTitle}>Introduction</Text>
            </View>
            <View style={styles.pageSubtitleContainer}>
              <Text style={styles.pageSubtitle}>Upload your video intro!</Text>
            </View>
          </View>
          <View style={styles.innerContainer}>
            <ProfileVideoForm
              onFormSubmit={imageSubmit}
              initialValues={influencer}
            />

            <View style={styles.pageSubtitleContainer}>
              <Text style={styles.name}>{influencer.name}</Text>
            </View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <View style={tw('w-1/4')}>
            <FormButton
              loading={state.loading}
              full
              onPress={goToApp}
              title="Finish"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    ...tw('w-full flex-col items-center justify-center mt-4'),
  },
  pageContainer: {
    ...Containers.contextContainer,
  },
  formContainer: {
    ...Containers.formContainer,
  },
  pageTitleContainer: {
    ...Containers.titleContainer,
  },
  pageSubtitleContainer: {
    ...Containers.subtitleContainer,
  },
  pageTitle: {
    ...Typography.title,
    ...tw('text-center'),
  },
  pageSubtitle: {
    ...Typography.subtitle,
    ...tw('text-center'),
  },
  name: {
    ...Typography.cardTitle,
  },
  nextButton: {
    ...Buttons.primaryButton,
    ...Buttons.formButton,
    minHeight: 65,
    borderColor: COLORS.secondary,
  },
  nextButtonText: {
    ...Buttons.lightButtonText,
    color: COLORS.secondary,
  },
  uploadForm: {
    marginVertical: 30,
  },
  buttonContainer: {
    ...tw(
      'w-full flex-row items-center justify-end border-t px-5 py-2 bg-white',
    ),
    borderColor: '#E8E8E8',
  },
});

export default ProfilePicturePage;
