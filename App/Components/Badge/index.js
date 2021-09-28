/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {COLORS} from 'Styles/colors.js';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import tw from 'tw';

export const Badge = ({number, size, fontSize, textStyle}) => {
  return (
    <View
      style={{
        ...styles.badgeContainer,
        height: size ? size : wp(5),
        minWidth: size ? size : wp(5),
        paddingHorizontal: 3,
        display: number ? 'flex' : 'none',
      }}>
      <Text
        style={{
          ...styles.badgeText,
          ...textStyle,
          fontSize: fontSize ? fontSize : wp(3),
        }}>
        {number > 99 ? '99+' : number}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    ...tw('items-center'),
    backgroundColor: COLORS.red,
    borderRadius: 999,
    width: 'auto',
  },
  badgeText: tw('text-white'),
});
