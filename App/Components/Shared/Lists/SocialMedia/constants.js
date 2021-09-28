import {View, StyleSheet, Image} from 'react-native';
import TikTokLogo from 'Assets/Images/tiktok.png';
import {Icon} from 'react-native-elements';
import React from 'react';
import {COLORS} from 'Styles/colors.js';

export const Platforms = {
  facebook: 'Facebook',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  twitter: 'Twitter',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
};

const styles = StyleSheet.create({
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
