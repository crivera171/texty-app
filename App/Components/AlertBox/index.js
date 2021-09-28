import React from 'react';
import {Buttons, Typography} from 'Styles';
import {StyleSheet, View, Text} from 'react-native';
import {COLORS} from 'Styles/colors';
import {Icon, Button} from 'react-native-elements';
import tw from 'tw';
import {Modal, TouchableWithoutFeedback, SafeAreaView} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

const constants = {
  success: {
    color: COLORS.green,
    icon: 'check-circle',
  },
  alert: {
    color: COLORS.blue,
    icon: 'exclamation-circle',
  },
  danger: {
    color: COLORS.red,
    icon: 'exclamation-triangle',
  },
};
export const AlertBox = ({
  visible,
  onDismiss,
  onSubmit,
  type,
  title,
  text,
  buttonText,
}) => {
  return (
    <Modal visible={!!visible} animationType="fade" transparent={true}>
      <SafeAreaView style={styles.safeAreaBg}>
        <TouchableWithoutFeedback onPress={onDismiss}>
          <View style={styles.modalContainer}>
            <View
              style={tw(
                'bg-white flex-col justify-start items-start rounded-md w-5/6 p-5',
              )}>
              <Icon
                size={wp(10)}
                color={constants[type]?.color || COLORS.blue}
                type="font-awesome-5"
                name={constants[type]?.icon || 'info'}
                solid
              />
              <View style={tw('my-2')}>
                <Text style={[Typography.title, tw('mt-2')]}>{title}</Text>
                <Text style={[Typography.subtitle, tw('mt-2')]}>{text}</Text>
              </View>
              <Button
                title={buttonText || 'Submit'}
                onPress={onSubmit}
                buttonStyle={{backgroundColor: constants[type]?.color}}
                containerStyle={[tw('rounded-full mt-2 w-full')]}
                titleStyle={[Typography.subtitle, tw('text-white')]}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    ...tw('flex-col justify-center items-center h-full'),
    marginTop: 10,
    width: '100%',
  },
  modalAction: {
    ...Buttons.transparentButton,
    justifyContent: 'center',
    width: '100%',
    marginTop: 40,
  },
  modalMainText: {
    marginVertical: 40,
    textAlign: 'center',
  },
  safeAreaBg: {backgroundColor: 'rgba(0,0,0,0.8)'},
});
