import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Buttons, Typography} from '@/Styles';
import {COLORS} from 'Styles/colors.js';

export const AddMoreButton = ({title, onPress}) => (
  <TouchableOpacity style={styles.addMoreButton} onPress={onPress}>
    <Text style={styles.plusButtonText}>+ </Text>
    <Text style={styles.addButtonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  addMoreButton: {
    ...Buttons.addMoreButton,
  },
  plusButtonText: {
    ...Typography.subtitle,
    ...Buttons.lightButtonText,
    color: COLORS.black,
  },
  addButtonText: {
    ...Typography.subtitle,
    ...Buttons.lightButtonText,
    color: COLORS.black,
  },
});
