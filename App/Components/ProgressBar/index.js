import React from 'react';
import {View, StyleSheet} from 'react-native';
import {COLORS} from '@/Styles/colors.js';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Containers} from '@/Styles';
import {Icon} from 'react-native-elements';
import tw from 'tw';

export const ProgressBar = ({steps, currentStepIndex}) => {
  return (
    <View style={styles.stepsContainer}>
      {[...Array(steps)].map((step, idx) => (
        <View
          key={idx}
          style={[tw('flex-row items-center'), idx === 0 ? null : {flex: 1}]}>
          {idx === 0 ? null : (
            <View
              style={[
                styles.line,
                {
                  backgroundColor:
                    currentStepIndex >= idx ? COLORS.blue : COLORS.darkGray,
                },
              ]}
            />
          )}
          <View
            style={[
              styles.step,
              {
                backgroundColor:
                  currentStepIndex >= idx ? COLORS.blue : COLORS.darkGray,
              },
            ]}>
            {currentStepIndex >= idx ? (
              <Icon
                size={16}
                color={COLORS.white}
                name="checkmark-sharp"
                type="ionicon"
              />
            ) : null}
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  stepsContainer: {
    ...Containers.cardContainer,
    paddingVertical: hp(1.8),
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  step: {
    height: 22,
    width: 22,
    backgroundColor: COLORS.blue,
    borderRadius: 22,
    ...tw('items-center justify-center z-10'),
  },
  line: {
    height: 4,
    marginHorizontal: 'auto',
    backgroundColor: COLORS.blue,
    flex: 1,
  },
});
