import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Typography} from '@/Styles';
import {FormButton} from '@/Components/Buttons/Button';
import tw from 'tw';

export const ButtonGroup = ({
  disableBackBtn,
  disableNextBtn,
  backTitle,
  nextTitle,
  onBack,
  onNext,
  loading,
}) => {
  return (
    <View style={styles.buttonGroupContainer}>
      <TouchableOpacity disabled={disableBackBtn || loading} onPress={onBack}>
        <Text
          style={[
            styles.buttonText,
            disableBackBtn ? tw('text-dark-gray') : null,
          ]}>
          {backTitle || 'Back'}
        </Text>
      </TouchableOpacity>
      <View style={tw('w-1/4')}>
        <FormButton
          disabled={disableNextBtn}
          onPress={onNext}
          title={nextTitle || 'Next'}
          loading={loading}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonGroupContainer: {
    ...tw(
      'w-full flex-row items-center justify-between border-t px-5 py-2 bg-white',
    ),
    borderColor: '#E8E8E8',
  },
  buttonText: {
    ...Typography.subtitle,
    ...tw('text-blue'),
  },
});
