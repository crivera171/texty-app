/* eslint-disable react-native/no-inline-styles */
import React, {useState, useContext, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {Containers, Typography} from '@/Styles';
import {ProfileStore} from 'State/ProfileContext';
import {COLORS} from 'Styles/colors.js';
import {SocialMediaStore} from 'State/SocialMediaContext';
import {Menu} from '@/Components/Menu';
import {Card} from '@/Components/Cards/Card';
import {Platforms, PlatformLogos} from './constants';
import {useNavigation} from '@react-navigation/native';
import {Icon} from 'react-native-elements';
import tw from 'tw';
export const SocialMediaList = () => {
  const [socialToEdit, setSocialToEdit] = useState(false);
  const {state, actions} = useContext(SocialMediaStore);
  const {state: influencerState} = useContext(ProfileStore);
  const {navigate} = useNavigation();
  const influencer = influencerState.profile;

  const links = useMemo(() => {
    return state.social_media.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at),
    );
  }, [state]);

  const onDelete = (smId) => {
    actions.removeSocialMedia(smId).then(() => {
      actions.getSocialMedia(influencer.influencer_id);
    });
  };

  const navigateToEdit = () => {
    navigate('createSocialMediaPage', {socialMedia: socialToEdit});
  };

  return (
    <>
      <Menu
        isVisible={!!socialToEdit}
        onDismiss={() => setSocialToEdit(false)}
        title="Social Media"
        actions={[
          {
            icon: 'edit',
            name: 'Edit',
            color: COLORS.blue,
            onActionPress: () => {
              navigateToEdit();
              setSocialToEdit(false);
            },
          },
          {
            icon: 'delete',
            name: 'Delete',
            color: COLORS.red,
            type: 'delete',
            last: true,
            onActionPress: () => {
              onDelete(socialToEdit.id);
              setSocialToEdit(false);
            },
          },
        ]}
      />

      <View style={tw('flex-1')}>
        <Card
          disabled
          title="Add social media profile"
          btnTitle="Add"
          hasBtn
          onBtnPress={navigateToEdit}
          containerStyle={{
            borderStyle: 'dashed',
            borderColor: COLORS.blue,
          }}
          borderColor={COLORS.blue}
          renderIcon={
            <Icon
              color={COLORS.blue}
              size={24}
              type="font-awesome-5"
              name="user-circle"
              style={styles.planIcon}
              solid
            />
          }
          description="These will be display on your profile page"
        />

        {links.length
          ? links.map((socialMedia, idx) => (
              <Card
                key={idx}
                onPress={() => setSocialToEdit(socialMedia)}
                title={Platforms[socialMedia.platform]}
                renderIcon={PlatformLogos[socialMedia.platform]}
                description={`@${socialMedia.handle}: ${socialMedia.reach}`}
              />
            ))
          : null}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  listScroll: {
    marginBottom: 20,
  },
  planLoader: {
    ...Containers.activeInformationContainer,
    ...Containers.flexCenter,
    width: '100%',
  },
  loaderText: {
    ...Typography.subtitle,
    ...Typography.textCenter,
  },
  planIcon: {
    borderRadius: 5,
    padding: 3,
    textAlign: 'center',
    textAlignVertical: 'center',
    alignItems: 'center',
  },
  planImage: {
    width: 22,
    height: 26,
  },
});
