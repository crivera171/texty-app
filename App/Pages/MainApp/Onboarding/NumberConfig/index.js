import React, {useCallback, useContext, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native';
import {NumberConfigForm} from '../../../../Components/Shared/Forms/NumberConfig/index.js';
import {ProfileStore} from 'State/ProfileContext';
import {events, useTracker} from 'utils/analytics';
import {useNavigation} from '@react-navigation/native';
import {useOnbordingSteps} from 'utils/onboarding';
import {Containers} from 'Styles';

const NumberConfigPage = () => {
  const {nextStep} = useOnbordingSteps();
  const {state: influencerState, actions} = useContext(ProfileStore);
  const {navigate} = useNavigation();
  useTracker(events.onboarding_phone);

  useEffect(() => {
    actions.fetchProfile();
  }, [actions.fetchProfile]);

  // using local state for numbers instead of reducer because
  // of re-rendering bug associated with global navigation
  const [numbers, setNumbers] = useState([]);

  const onFormSubmit = useCallback(
    ({phone_number}) =>
      actions.selectTwilioNumber({phone_number}).then(() => {
        actions
          .editProfile({onboardingStep: nextStep, has_onboarded: false})
          .then(() => {
            navigate(nextStep);
          });
      }),
    [actions.selectTwilioNumber, actions.editProfile],
  );

  const onFormChange = useCallback(
    ({state, city}) =>
      actions.getTwilioNumbers({state, city}).then((twilNumbers) => {
        setNumbers(twilNumbers);
      }),
    [actions.getTwilioNumber, setNumbers],
  );

  useEffect(() => {
    actions.getTwilioNumbers().then((twilNumbers) => {
      setNumbers(twilNumbers);
    });
  }, [actions.getTwilioNumbers, setNumbers]);

  return (
    <SafeAreaView style={Containers.safeAreaContainer}>
      <NumberConfigForm
        loading={influencerState.loading}
        onFormChange={onFormChange}
        onFormSubmit={onFormSubmit}
        initialValues={numbers}
      />
    </SafeAreaView>
  );
};

export default NumberConfigPage;
