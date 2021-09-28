import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Typography, Buttons} from 'Styles';
import {Icon} from 'react-native-elements';
import {COLORS} from 'Styles/colors.js';

const styles = StyleSheet.create({
  closeButton: {
    ...Buttons.transparentButton,
    position: 'absolute',
    width: 60,
    top: 10,
    right: 0,
  },
  closeButtonText: {
    ...Typography.closeIcon,
  },
});

export const CloseButton = ({onPress}) => {
  return (
    <TouchableOpacity style={styles.closeButton} onPress={onPress}>
      <Icon
        size={24}
        color={COLORS.darkGray}
        type="ionicon"
        style={styles.closeButtonText}
        name="close-outline"
      />
    </TouchableOpacity>
  );
};
