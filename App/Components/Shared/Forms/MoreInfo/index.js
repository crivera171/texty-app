/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, StyleSheet, Text, Keyboard, Platform} from 'react-native';
import {Formik} from 'formik';
import {Inputs, Buttons, Containers} from '../../../../Styles';
import {COLORS} from '../../../../Styles/colors.js';
import DropDownPicker from 'react-native-dropdown-picker';
import * as Yup from 'yup';
import genders from './constants/genders';
import {FormButton} from '@/Components/Buttons/Button';
import DatePicker from 'react-native-datepicker';
import {Input} from '@/Components/Inputs/Input';

const MoreInfoSchema = Yup.object().shape({
  zip: Yup.string()
    .min(5, 'Zip Code is too short - should be 5 chars minimum.')
    .max(5, 'Zip Code is too long - should be 5 chars maximum.')
    .required('Ender ZIP code'),
  dob: Yup.string().required('Enter your date of birth'),
  gender: Yup.string().required('Select your gender'),
});

export const MoreInfoForm = ({loading, initialValues = {}, onFormSubmit}) => {
  const [validatingRealTime, setValidatingRealTime] = useState(false);

  // Run this on form submit
  const addInfo = (data) => {
    onFormSubmit(data);
  };

  const [zip, setZip] = useState(initialValues.zip || '');
  const [dob, setDob] = useState(initialValues.dob || '01-01-1990');
  const [gender, setGender] = useState(initialValues.gender || '');

  return (
    <Formik
      initialValues={{gender, dob, zip}}
      onSubmit={addInfo}
      validationSchema={MoreInfoSchema}
      validateOnBlur={false}
      validateOnChange={validatingRealTime}>
      {(props) => (
        <View>
          <View
            style={{
              ...(Platform.OS !== 'android' && {
                zIndex: 11,
              }),
            }}>
            <DropDownPicker
              items={genders}
              onChangeItem={(itemValue) => {
                props.setFieldValue('gender', itemValue.value);
                setGender(itemValue.value);
              }}
              placeholder="Gender"
              containerStyle={styles.dropdownContainerStyle}
              activeLabelStyle={styles.dropdownActiveLabel}
              labelStyle={styles.dropdownLabel}
              style={[
                styles.dropdown,
                props.errors.gender && Inputs.inputError,
              ]}
              itemStyle={styles.dropdownItems}
              autoCapitalize={'none'}
              name="gender"
            />
          </View>
          {props.errors.gender && (
            <Text style={styles.validationError}>{props.errors.gender}</Text>
          )}
          <View
            style={[
              styles.datepickerContainer,
              props.errors.dob && Inputs.inputError,
            ]}>
            <Text>Date of Birth</Text>
            <DatePicker
              androidMode="spinner"
              date={dob}
              name="dob"
              mode="date"
              format="MM/DD/YYYY"
              minDate="01-01-1900"
              maxDate="01-01-2021"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              showIcon={false}
              placeholder="Date of Birth"
              customStyles={{
                dateInput: {
                  ...styles.datepickerText,
                  borderWidth: 0,
                  fontSize: 50,
                  textAlign: 'left',
                  alignItems: 'flex-start',
                },
                datePicker: {
                  width: '100%',
                  justifyContent: 'center',
                },
                dateText: styles.datepickerText,
                placeholderText: styles.datepickerText,
                btnTextConfirm: {
                  ...styles.datepickerText,
                  color: COLORS.blue,
                },
                btnTextCancel: {
                  ...styles.datepickerText,
                  color: COLORS.secondary,
                },
              }}
              style={{width: '100%'}}
              onDateChange={(date) => {
                setDob(date);
                props.setFieldValue('dob', date);
              }}
            />
          </View>
          <View>
            {props.errors.dob && (
              <Text style={styles.validationError}>{props.errors.dob}</Text>
            )}
          </View>

          <Input
            label="ZIP Code"
            onChangeText={(zipText) => {
              props.handleChange('zip')(zipText);
              setZip(zipText);
            }}
            error={props.errors.zip}
            value={zip}
            keyboardType="number-pad"
          />
          <View style={styles.buttonContainer}>
            <FormButton
              style={styles.nextButton}
              rounded
              full
              loading={loading}
              onPress={() => {
                Keyboard.dismiss();
                props.handleSubmit();
                setValidatingRealTime(true);
              }}>
              <Text style={styles.nextButtonText}>Next Step</Text>
            </FormButton>
          </View>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  datepickerContainer: {
    ...Inputs.datepickerContainer,
    justifyContent: 'center',
  },
  datepickerText: {
    ...Inputs.datepickerText,
  },
  validationError: {
    ...Inputs.validationError,
  },
  buttonContainer: {
    ...Containers.itemContainer,
  },
  inputContainer: {
    ...Inputs.inputContainer,
  },
  inputLabel: {
    ...Inputs.inputLabel,
  },
  themedInput: {
    ...Inputs.noIconInput,
  },
  dropdownContainerStyle: {
    ...Inputs.dropdownContainerStyle,
  },
  dropdownActiveLabel: {
    ...Inputs.dropdownActiveLabel,
  },
  dropdownLabel: {
    ...Inputs.dropdownLabel,
  },
  dropdown: {
    ...Inputs.dropdown,
  },
  dropdownItems: {
    ...Inputs.dropdownItems,
  },
  nextButton: {
    ...Buttons.primaryButton,
    ...Buttons.formButton,
  },
  nextButtonText: {
    ...Buttons.lightButtonText,
  },
  helpText: {
    color: COLORS.muted,
    fontSize: 14,
    marginLeft: 10,
    marginTop: 5,
  },
});
