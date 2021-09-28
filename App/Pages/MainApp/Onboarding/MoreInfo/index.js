import React, {useCallback, useContext, useEffect} from 'react';
import {View, ScrollView, Text, StyleSheet, Image} from 'react-native';
import {Containers, Typography} from '../../../../Styles';
import {MoreInfoForm} from '@/Components/Shared/Forms/MoreInfo/index.js';
import {Throbbler} from '@/Components/Shared/Throbbler/index.js';
import {ProfileStore} from 'State/ProfileContext';
import Logo from 'Assets/Images/logo.png';
import {useNavigation} from '@react-navigation/native';
import {useOnbordingSteps} from 'utils/onboarding';

const MoreInfoPage = () => {
  const {nextStep} = useOnbordingSteps();
  const {state, actions} = useContext(ProfileStore);
  const {navigate} = useNavigation();
  useEffect(() => {
    actions.fetchProfile();
  }, [actions.fetchProfile]);

  const onFormSubmit = useCallback(
    ({gender, dob, zip, marital_status}) =>
      actions
        .editProfile({
          gender,
          dob,
          zip,
          marital_status,
          onboardingStep: nextStep,
        })
        .then(() => {
          navigate(nextStep);
        }),
    [actions.editProfile],
  );

  return (
    <View style={styles.pageContainer}>
      {!state || !state.hasFetched || !state.profile ? (
        <Throbbler />
      ) : (
        <>
          <ScrollView>
            <View>
              <Image style={styles.signupImageContainer} source={Logo} />
            </View>
            <View style={styles.pageTitleContainer}>
              <Text style={styles.pageTitle}>Details</Text>
            </View>
            <View style={styles.pageSubtitleContainer}>
              <Text style={styles.pageSubtitle}>Tell us about yourself</Text>
            </View>
            <MoreInfoForm
              loading={state.loading}
              onFormSubmit={onFormSubmit}
              initialValues={state.profile}
            />
          </ScrollView>
        </>
      )}
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
  buttonContainer: {
    ...Containers.itemContainer,
  },
  pageTitle: {
    ...Typography.title,
  },
  pageSubtitle: {
    ...Typography.subtitle,
    ...Typography.textCenter,
  },
  signupImageContainer: {
    ...Containers.logoContainer,
  },
});

export default MoreInfoPage;
