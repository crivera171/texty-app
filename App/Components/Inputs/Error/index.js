import React, {useRef, useEffect} from 'react';
import {Animated, Text} from 'react-native';
import tw from 'tw';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Typography} from 'Styles';

export const Error = ({error}) => {
  const height = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(height, {
      toValue: error ? hp(4) : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [error]);

  return (
    <Animated.View
      style={[tw('bg-red justify-center overflow-hidden'), {height}]}>
      <Text style={[Typography.notice, tw('text-white p-2')]}>{error}</Text>
    </Animated.View>
  );
};
