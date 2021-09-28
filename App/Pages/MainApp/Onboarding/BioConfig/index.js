import React, {useCallback, useContext, useEffect} from 'react';
import {View, ScrollView, StyleSheet, Image, Text} from 'react-native';
import {Buttons, Containers, Typography} from '../../../../Styles';
import {BioConfigForm} from '../../../../Components/Shared/Forms/BioConfiguration/index.js';
import {ProfileStore} from 'State/ProfileContext';
import Logo from 'Assets/Images/logo.png';
import {useNavigation} from '@react-navigation/native';
import {useOnbordingSteps} from 'utils/onboarding';

const BioConfigPage = () => {
  const {nextStep} = useOnbordingSteps();
  const {navigate} = useNavigation();
  const {state, actions} = useContext(ProfileStore);

  useEffect(() => {
    actions.fetchProfile();
  }, [actions.fetchProfile]);

  const onFormSubmit = useCallback(
    ({bio, profession}) =>
      actions
        .editProfile({
          bio,
          profession,
          onboardingStep: nextStep,
        })
        .then(() => {
          navigate(nextStep);
        }),
    [actions.editProfile],
  );

  return (
    <View style={styles.pageContainer}>
      <ScrollView>
        <View>
          <Image style={styles.signupImageContainer} source={Logo} />
        </View>
        <View style={styles.pageTitleContainer}>
          <Text style={styles.pageTitle}>Bio Configuration</Text>
        </View>
        <View style={styles.pageSubtitleContainer}>
          <Text style={styles.pageSubtitle}>
            This info will be displayed in your profile
          </Text>
        </View>
        <BioConfigForm
          loading={state.loading}
          onFormSubmit={onFormSubmit}
          initialValues={state.profile}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    ...Containers.contextContainer,
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
    ...Typography.textCenter,
  },
  nextButton: {
    ...Buttons.primaryButton,
  },
  nextButtonText: {
    ...Buttons.lightButtonText,
  },
  signupImageContainer: {
    ...Containers.logoContainer,
  },
});

export default BioConfigPage;
