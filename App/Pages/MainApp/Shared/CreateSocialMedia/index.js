import React, {useMemo, useCallback, useContext} from 'react';
import {View, Alert} from 'react-native';
import {SocialMediaForm} from '@/Components/Shared/Forms/SocialMedia';
import {SocialMediaStore} from 'State/SocialMediaContext';
import {ProfileStore} from 'State/ProfileContext';
import {events, useTracker} from 'utils/analytics';
import {Containers} from '@/Styles';

const CreateSocialMediaPage = ({route, navigation}) => {
  const {socialMedia} = route.params;
  const {actions} = useContext(SocialMediaStore);
  const {state: influencerState} = useContext(ProfileStore);
  const influencer = influencerState.profile;
  const {track} = useTracker();

  const close = () => {
    navigation.goBack();
  };

  const onFormSubmit = useCallback(
    ({platform, reach, handle, id}) => {
      actions
        .saveSocialMedia({platform, reach, handle, id})
        .then(() => {
          track(id ? events.edit_social_media : events.create_social_media, {
            platform,
            handle,
          });
          actions.getSocialMedia(influencer.influencer_id);
          close();
        })
        .catch(() => {
          Alert.alert(
            'Error',
            'An error has occured while adding your social media account.',
          );
        });
    },
    [actions.saveSocialMedia],
  );

  const initialValues = useMemo(() => {
    if (socialMedia) {
      return socialMedia;
    }
    return {};
  }, [socialMedia]);

  return (
    <View style={Containers.background}>
      <SocialMediaForm
        onFormSubmit={onFormSubmit}
        onDismiss={close}
        initialValues={initialValues}
      />
    </View>
  );
};

export default CreateSocialMediaPage;
