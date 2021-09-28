import React, {useState, useContext, useMemo} from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {Containers, Typography} from '@/Styles';
import {COLORS} from 'Styles/colors.js';
import {SocialMediaStore} from 'State/SocialMediaContext';
import {Menu} from '@/Components/Menu';
import TikTokLogo from 'Assets/Images/tiktok.png';
import {Icon} from 'react-native-elements';
import {Platforms} from './constants';
import {useNavigation} from '@react-navigation/native';
import AddSM from '@/Assets/Images/SocialMedia/addMore.png';
import tw from 'tw';
export const SocialMediaCompactList = ({id}) => {
  const [socialToEdit, setSocialToEdit] = useState(false);
  const {state, actions} = useContext(SocialMediaStore);
  const {navigate} = useNavigation();

  const links = useMemo(() => {
    return state.social_media.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at),
    );
  }, [state]);

  const onDelete = (smId) => {
    actions.removeSocialMedia(smId).then(() => {
      actions.getSocialMedia(id);
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
        title={
          socialToEdit
            ? Platforms[socialToEdit.platform].link + socialToEdit.handle
            : 'Social Media'
        }
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
      <ScrollView horizontal>
        <View style={tw('flex-row justify-between w-full')}>
          <TouchableOpacity
            onPress={navigateToEdit}
            style={tw('justify-center')}>
            {state.loading ? (
              <ActivityIndicator
                style={tw('px-2')}
                size={27}
                color={COLORS.gray}
              />
            ) : (
              <Image source={AddSM} />
            )}
          </TouchableOpacity>
          {links.map((socialMedia, idx) => (
            <TouchableOpacity
              onPress={() => setSocialToEdit(socialMedia)}
              style={tw('ml-2')}
              key={idx}>
              <Image source={Platforms[socialMedia.platform].img} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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

export const PlatformLogos = {
  facebook: (
    <Icon
      type="ionicon"
      color={COLORS.blue}
      size={24}
      name="logo-facebook"
      style={styles.planIcon}
    />
  ),
  instagram: (
    <Icon
      type="ionicon"
      color={COLORS.blue}
      size={24}
      name="logo-instagram"
      style={styles.planIcon}
    />
  ),
  twitter: (
    <Icon
      type="ionicon"
      color={COLORS.blue}
      size={24}
      name="logo-twitter"
      style={styles.planIcon}
    />
  ),
  tiktok: (
    <View style={styles.planIcon}>
      <Image style={styles.planImage} source={TikTokLogo} />
    </View>
  ),
  youtube: (
    <Icon
      type="ionicon"
      color={COLORS.blue}
      size={24}
      name="logo-youtube"
      style={styles.planIcon}
    />
  ),
  linkedin: (
    <Icon
      type="ionicon"
      color={COLORS.blue}
      size={24}
      name="logo-linkedin"
      style={styles.planIcon}
    />
  ),
};
