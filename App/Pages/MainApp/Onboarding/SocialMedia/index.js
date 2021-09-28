import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, Text, SafeAreaView, Alert, ScrollView} from 'react-native';
import {Containers, Typography} from '../../../../Styles';
import {ProfileStore} from 'State/ProfileContext';
import {SocialMediaList} from '../../../../Components/Shared/Lists/SocialMedia';
import {FormButton} from '@/Components/Buttons/Button';
import {events, useTracker} from 'utils/analytics';
import {useNavigation} from '@react-navigation/native';
import {useOnbordingSteps} from 'utils/onboarding';
import tw from 'tw';

const SocialMediaPage = () => {
  const {nextStep} = useOnbordingSteps();
  const {navigate} = useNavigation();
  const [loading, setLoading] = useState(true);
  const {actions: influencerActions} = useContext(ProfileStore);

  const {track} = useTracker(events.onboarding_social_media);

  useEffect(() => {
    influencerActions
      .fetchProfile()
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        Alert.alert('Could not fetch profile. Try again later.');
        setLoading(false);
      });
  }, [influencerActions.fetchProfile]);

  return (
    <SafeAreaView style={Containers.safeAreaContainer}>
      <View style={tw('h-full flex-1 bg-white')}>
        <ScrollView>
          <View style={tw('p-5 flex-1')}>
            <View style={styles.formContainer}>
              <View>
                <View style={styles.pageTitleContainer}>
                  <Text style={styles.pageTitle}>Social Media</Text>
                </View>
                <View style={styles.pageSubtitleContainer}>
                  <Text style={styles.pageSubtitle}>
                    Tell us about your social media presence
                  </Text>
                </View>
              </View>
              {!loading && <SocialMediaList />}
            </View>
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <View style={tw('w-1/4')}>
            <FormButton
              loading={loading}
              full
              onPress={() => {
                track(events.onboarding_social_media_submit);
                influencerActions
                  .editProfile({onboardingStep: nextStep, has_onboarded: false})
                  .then(() => {
                    navigate(nextStep);
                  });
              }}
              title="Next"
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  },
  pageSubtitle: {
    ...Typography.subtitle,
    ...tw('mt-1 mb-3'),
  },
  signupImageContainer: {
    ...Containers.logoContainer,
  },
  buttonContainer: {
    ...tw(
      'w-full flex-row items-center justify-end border-t px-5 py-2 bg-white',
    ),
    borderColor: '#E8E8E8',
  },
});

export default SocialMediaPage;
