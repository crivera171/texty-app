import React from 'react';
import {View, StyleSheet, SafeAreaView, StatusBar} from 'react-native';
import {Containers} from '../../../../Styles';
import {Throbbler} from '@/Components/Shared/Throbbler/index.js';
import tw from 'tw';
import {COLORS} from '@/Styles/colors.js';

const Loader = () => (
  <SafeAreaView style={tw('bg-white h-full')}>
    <StatusBar translucent backgroundColor={COLORS.white} />
    <View style={styles.pageContainer}>
      <View style={styles.pageTitleContainer}>
        <Throbbler />
      </View>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  pageContainer: {
    ...Containers.background,
  },
  pageTitleContainer: {
    ...Containers.titleContainer,
    flex: 1,
    alignItems: 'center',
  },
});

export default Loader;
