import React, {useCallback, useContext} from 'react';
import {ProfileSettingsForm} from '@/Components/Shared/Forms/ProfileSettings/index.js';
import {ProfileStore} from 'State/ProfileContext';
import {View} from 'react-native';

const ModifyProfilePage = ({navigation}) => {
  const {state, actions} = useContext(ProfileStore);

  const profileSubmit = useCallback(
    ({name, bio, avg_response_time}) =>
      actions
        .editProfile({
          name,
          bio,
          avg_response_time,
        })
        .then(() => navigation.goBack()),
    [actions.editProfile],
  );

  return (
    <View>
      <ProfileSettingsForm
        loading={state.loading}
        onFormSubmit={profileSubmit}
        initialValues={state.profile}
        onDismiss={() => navigation.goBack()}
      />
    </View>
  );
};

export default ModifyProfilePage;
