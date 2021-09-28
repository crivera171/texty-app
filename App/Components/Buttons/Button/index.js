import React from 'react';
import {StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';
import tw from 'tw';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

export const FormButton = (props) => (
  <Button
    titleStyle={styles.btnTextStyle}
    disabledStyle={tw('bg-blue')}
    disabledTitleStyle={tw('text-gray')}
    buttonStyle={tw('py-2 bg-blue')}
    containerStyle={tw('rounded-full border-2 border-blue bg-blue mr-1 w-full')}
    {...props}
    disabled={props.disabled || props.loading}
    loading={props.loading}
    title={props.title}
  />
);

const styles = StyleSheet.create({
  btnTextStyle: {
    ...tw('text-white text-center font-medium'),
    fontSize: wp(4),
  },
});
