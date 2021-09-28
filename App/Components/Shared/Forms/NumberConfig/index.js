import React, {useState, useMemo} from 'react';
import {View, StyleSheet, Text, Keyboard, ScrollView} from 'react-native';
import {Formik} from 'formik';
import {Inputs, Containers, Typography} from '../../../../Styles';
import {FormButton} from '@/Components/Buttons/Button';
import states from './states';
import * as Yup from 'yup';
import {Input} from '@/Components/Inputs/Input';
import {Picker} from '@/Components/Inputs/Picker';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import tw from 'tw';

const NumberConfigurationSchema = Yup.object().shape({
  area_code: Yup.string()
    .min(3, 'Not a valid area code.')
    .max(3, 'Not a valid area code.'),
  twilio_phone_id: Yup.string(),
  phone_number: Yup.string().required('Select your virtual number'),
});

export const NumberConfigForm = ({
  loading,
  initialValues,
  onFormSubmit,
  onFormChange,
}) => {
  const [validatingRealTime, setValidatingRealTime] = useState(false);
  const [state, setState] = useState('');
  const [city, setCity] = useState('');

  // Run this on form submit
  const configureTwillioNumber = (data) => {
    onFormSubmit(data);
  };

  const [phone_number, setTwillioNumber] = useState('');
  const [twilio_phone_id, setTwillioId] = useState('');

  const twilioNumbers = initialValues || [];

  const dropdownItems = useMemo(() => {
    return twilioNumbers.map(({friendly_name, number}) => {
      const itemList = {};
      itemList.label = `${friendly_name}`;
      itemList.value = `${number}`;
      return itemList;
    });
  }, [twilioNumbers]);

  return (
    <Formik
      initialValues={{
        phone_number,
        twilio_phone_id,
      }}
      onSubmit={(values) => {
        configureTwillioNumber(values);
      }}
      validationSchema={NumberConfigurationSchema}
      validateOnBlur={false}
      validateOnChange={validatingRealTime}>
      {(props) => (
        <View style={tw('h-full')}>
          <ScrollView>
            <View style={tw('p-5 flex-1')}>
              <View style={styles.pageTitleContainer}>
                <Text style={styles.pageTitle}>Number Configuration</Text>
              </View>
              <View style={styles.pageSubtitleContainer}>
                <Text style={styles.pageSubtitle}>
                  Select your Texty number
                </Text>
              </View>
              <Picker
                label="State"
                values={states}
                inputTextStyle={tw('capitalize')}
                onChangeItem={(stateValue) => {
                  setState(stateValue.value);
                  onFormChange({state: stateValue.value, city});
                }}
                placeholder="Select"
              />

              <Input
                label="City (optional)"
                onChangeText={(cityValue) => {
                  setCity(cityValue);
                  onFormChange({city: cityValue, state});
                }}
              />
              <Text style={styles.inputNote}>
                You can use state and city fields to narrow your phone number
                options
              </Text>
              <Picker
                label="Texty Number"
                values={dropdownItems}
                onChangeItem={(itemValue) => {
                  props.setFieldValue('phone_number', itemValue);
                  setTwillioNumber(itemValue.label);
                  props.setFieldValue('twilio_phone_id', itemValue);
                  setTwillioId(itemValue);
                }}
                placeholder="Select"
                error={props.errors.phone_number}
              />
            </View>
          </ScrollView>
          <View style={styles.buttonContainer}>
            <View style={tw('w-1/4')}>
              <FormButton
                loading={loading}
                full
                onPress={() => {
                  Keyboard.dismiss();
                  props.handleSubmit();
                  setValidatingRealTime(true);
                }}
                title="Next"
              />
            </View>
          </View>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  validationError: {
    ...Inputs.validationError,
  },
  inputNote: {
    ...Typography.notice,
    marginBottom: hp(4),
  },
  pageTitleContainer: Containers.titleContainer,
  pageSubtitleContainer: Containers.subtitleContainer,
  pageTitle: {
    ...Typography.title,
  },
  pageSubtitle: {
    ...Typography.subtitle,
    ...tw('mt-1 mb-4'),
  },
  buttonContainer: {
    ...tw(
      'w-full flex-row items-center justify-end border-t px-5 py-2 bg-white',
    ),
    borderColor: '#E8E8E8',
  },
});
