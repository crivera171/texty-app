import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Typography} from 'Styles';
import {COLORS} from 'Styles/colors';
import tw from 'tw';
export const Day = ({active, text}) => {
  return (
    <View
      style={[
        styles.dayContainer,
        active ? {backgroundColor: COLORS.blue} : '',
      ]}>
      <Text style={[styles.dayText, active ? {color: COLORS.white} : '']}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  dayContainer: {
    backgroundColor: COLORS.lightGray,
    color: COLORS.black,
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  dayText: {
    ...Typography.subtitle,
    ...tw('text-center'),
    lineHeight: 40,
  },
});
