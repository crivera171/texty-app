import React, {useMemo} from 'react';
import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import {COLORS} from '@/Styles/colors.js';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Containers, Typography} from '@/Styles';
import {Icon} from 'react-native-elements';

export const Steps = ({onStepChange, currentStepIndex, steps}) => {
  return (
    <View style={styles.container}>
      <View style={styles.stepsContainer}>
        {steps.map((step, idx) => (
          <TouchableOpacity
            style={styles.stepContainer}
            key={idx}
            onPress={() => {
              if (idx <= currentStepIndex) {
                onStepChange(steps[idx].key);
              }
            }}>
            <View
              style={[
                styles.step,
                idx <= currentStepIndex ? styles.activeStep : null,
              ]}>
              {idx < currentStepIndex ? (
                <Icon
                  size={16}
                  color={COLORS.white}
                  name="checkmark-sharp"
                  type="ionicon"
                />
              ) : (
                <Text
                  style={[
                    styles.stepText,
                    idx <= currentStepIndex ? styles.stepTextActive : null,
                  ]}>
                  {idx + 1}
                </Text>
              )}
            </View>
            {idx === currentStepIndex ? (
              <Text style={styles.stepTitle}>{step.title}</Text>
            ) : null}
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressBarFill,
            {width: `${((currentStepIndex + 1) / steps.length) * 100}%`},
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexWrap: 'wrap',
  },
  progressBar: {
    backgroundColor: COLORS.inputBorderColor,
    height: 3,
    width: '100%',
    position: 'relative',
  },
  progressBarFill: {
    position: 'absolute',
    backgroundColor: COLORS.blue,
    top: 0,
    bottom: 0,
    left: 0,
  },
  stepsContainer: {
    ...Containers.cardContainer,
    paddingVertical: hp(1.8),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepTitle: {
    ...Typography.subtitle,
    color: COLORS.blue,
    minWidth: wp(30),
  },
  stepText: {
    color: COLORS.darkGray,
  },
  stepTextActive: {
    color: COLORS.white,
  },
  step: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.darkGray,
    color: COLORS.lightGray,
    width: wp(6),
    height: wp(6),
    borderRadius: wp(3),
    marginHorizontal: 10,
    elevation: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  activeStep: {
    borderWidth: 1,
    borderColor: COLORS.blue,
    overflow: 'hidden',
    backgroundColor: COLORS.blue,
    color: COLORS.white,
    borderRadius: wp(3),
  },
});
