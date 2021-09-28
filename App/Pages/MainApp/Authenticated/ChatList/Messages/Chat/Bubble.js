import React from 'react';
import {Bubble as BaseBubble} from 'react-native-gifted-chat';
import {COLORS} from 'Styles/colors';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  bubbleWrapperLeft: {
    margin: 3,
    padding: 0,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 10,
    overflow: 'hidden',
  },
  bubbleWrapperRight: {
    margin: 3,
    padding: 0,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.blue,
    borderRadius: 10,
    overflow: 'hidden',
  },
});

export const Bubble = (props) => {
  return (
    <BaseBubble
      {...props}
      textStyle={{
        right: {
          color: COLORS.black,
          paddingTop: 3,
        },
        left: {
          color: COLORS.black,
          paddingTop: 3,
        },
      }}
      wrapperStyle={{
        left: styles.bubbleWrapperLeft,
        right: styles.bubbleWrapperRight,
      }}
    />
  );
};
