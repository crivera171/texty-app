import React from 'react';
import {View} from 'react-native';
import {Icon} from 'react-native-elements';
import tw from 'tw';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {COLORS} from 'Styles/colors.js';

export const Reviews = ({rating}) => {
  return (
    <View style={tw('flex flex-row items-center')}>
      {[...Array(5)].map((i, idx) => (
        <Icon
          key={idx}
          type="ionicon"
          color={idx + 1 <= rating ? COLORS.yellow : COLORS.gray}
          size={wp(4.5)}
          name="star"
        />
      ))}
    </View>
  );
};
