import React, {useCallback, useContext, useEffect} from 'react';
import {SafeAreaView} from 'react-native';
import {StoryForm} from '../../../../Components/Shared/Forms/Story';
import {ProfileStore} from 'State/ProfileContext';
import {useTracker, events} from 'utils/analytics';
import {useNavigation} from '@react-navigation/native';
import {useOnbordingSteps} from 'utils/onboarding';
import {Containers} from 'Styles';

const StoryPage = () => {
  const {nextStep} = useOnbordingSteps();
  const {state, actions} = useContext(ProfileStore);
  useTracker(events.onboarding_referral_source);
  const {navigate} = useNavigation();

  useEffect(() => {
    actions.fetchProfile();
  }, [actions.fetchProfile]);

  const onFormSubmit = useCallback(
    ({ref_source}) =>
      actions
        .editProfile({
          onboardingStep: nextStep,
          has_onboarded: false,
          ref_source,
        })
        .then(() => {
          navigate(nextStep);
        }),
    [actions.editProfile],
  );

  return (
    <SafeAreaView style={Containers.safeAreaContainer}>
      <StoryForm
        loading={state.loading}
        onFormSubmit={onFormSubmit}
        initialValues={state.profile}
      />
    </SafeAreaView>
  );
};

export default StoryPage;
