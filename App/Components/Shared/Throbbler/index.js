import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import LogoTransparent from '../../../Assets/Images/logoAnimated.gif';

export const Throbbler = () => {
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={LogoTransparent} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 60,
  },
});
