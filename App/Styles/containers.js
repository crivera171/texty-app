import tw from 'tw';
import {StyleSheet, Platform, StatusBar} from 'react-native';
import {COLORS} from './colors.js';

export const Containers = StyleSheet.create({
  background: tw('h-full bg-white'),
  container: {
    ...tw('bg-white py-2 px-5'),
    borderBottomWidth: 1,
    borderColor: COLORS.gray,
  },
  section: {
    ...tw('mt-4 bg-white'),
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: COLORS.gray,
  },
  formContainer: tw('justify-between overflow-scroll flex-grow'),
  safeAreaContainer: {
    ...tw('bg-white flex-1'),
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
