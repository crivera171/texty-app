import React, {useState, useCallback, useContext} from 'react';
import {View} from 'react-native';
import {ProfileStore} from 'State/ProfileContext';
import {ScrollView} from 'react-native';
import CallSchedulingForm from '@/Components/Shared/Forms/CallScheduling';
import {Containers} from 'Styles';

const CallSchedulingPage = ({route, navigation}) => {
  const {actions, state} = useContext(ProfileStore);
  const [errors, setErrors] = useState(null);

  const onFormSubmit = useCallback(
    async ({timezone}) => {
      const result = await actions.editTimezone(timezone);
      if (result.errors) {
        setErrors(result.errors);
      } else {
        navigation.goBack();
      }
    },
    [actions.editTimezone],
  );

  return (
    <ScrollView>
      <View style={Containers.background}>
        <CallSchedulingForm
          navigation={navigation}
          onDismiss={() => navigation.goBack()}
          onFormSubmit={onFormSubmit}
          errors={errors}
          initialValues={{timezone: state.profile.timezone_name}}
        />
      </View>
    </ScrollView>
  );
};

export default CallSchedulingPage;
