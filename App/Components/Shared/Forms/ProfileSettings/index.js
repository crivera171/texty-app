import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Formik} from 'formik';
import {Inputs, Containers} from 'Styles';
import {COLORS} from 'Styles/colors.js';
import {Header} from '@/Components/Layout/Header';
import * as Yup from 'yup';
import {Input} from '@/Components/Inputs/Input';
import {numberFilter} from '@/utils/number';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import tw from 'tw';

const ProfileSchema = Yup.object().shape({
  name: Yup.string().required('This field is required'),
  bio: Yup.string().required('This field is required'),
  avg_response_time: Yup.number()
    .typeError('Enter a number')
    .min(1, '1 hour minimum')
    .max(24, '24 hours maximum')
    .required('This field is required'),
});

export const ProfileSettingsForm = ({
  loading,
  initialValues = {},
  onFormSubmit,
  onDismiss,
}) => {
  const [validatingRealTime, setValidatingRealTime] = useState(false);

  const [name, setName] = useState(initialValues.name || '');
  const [bio, setBio] = useState(initialValues.bio || '');
  const [avgResponeTime, setAvgResponseTime] = useState(
    initialValues.avg_response_time || '4',
  );

  return (
    <Formik
      initialValues={{
        name,
        bio,
        avg_response_time: avgResponeTime,
      }}
      onSubmit={onFormSubmit}
      validateOnBlur={false}
      validateOnChange={validatingRealTime}
      validationSchema={ProfileSchema}>
      {(props) => (
        <View style={styles.pageContainer}>
          <KeyboardAwareScrollView>
            <Header
              title="Edit Profile"
              handleBack={onDismiss}
              handleDone={() => {
                props.handleSubmit();
                setValidatingRealTime(true);
              }}
              loading={loading}
            />
            <View style={styles.container}>
              <Input
                label="Full Name"
                onChangeText={(nameText) => {
                  props.handleChange('name')(nameText);
                  setName(nameText);
                }}
                error={props.errors.name}
                value={name}
              />

              <Input
                label="Average Response Time (in hours)"
                onChangeText={(timeText) => {
                  const time = numberFilter(timeText);
                  props.handleChange('avg_response_time')(time);
                  setAvgResponseTime(timeText);
                }}
                placeholder="4"
                error={props.errors.avg_response_time}
                value={String(avgResponeTime)}
                mask="[99]"
              />

              <Input
                label="About Me"
                onChangeText={(bioText) => {
                  props.handleChange('bio')(bioText);
                  setBio(bioText);
                }}
                error={props.errors.bio}
                value={bio}
                multiline={true}
                numberOfLines={4}
                name="bio"
              />
            </View>
          </KeyboardAwareScrollView>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    height: '100%',
    backgroundColor: COLORS.white,
  },
  container: {
    ...tw('px-5 mt-4'),
    height: '100%',
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
    ...Inputs.stackedLabel,
  },
  themedInput: {
    ...Inputs.stackedInput,
  },
  inputWrapper: {
    ...Inputs.stackedInputWrapper,
  },
  styledTextarea: {
    ...Inputs.stackedTextarea,
  },
});
