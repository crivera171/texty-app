import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Keyboard, TextInput} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {Inputs, Buttons, Containers} from 'Styles';
import {FormButton} from '@/Components/Buttons/Button';

const BioConfigSchema = Yup.object().shape({
  bio: Yup.string().required('Cannot be blank'),
});

export const BioConfigForm = ({loading, initialValues = {}, onFormSubmit}) => {
  const [validatingRealTime, setValidatingRealTime] = useState(false);

  // Run this on form submit
  const updateProfile = (data) => {
    onFormSubmit(data);
  };

  const [profession, setProfession] = useState(initialValues.profession || '');
  const [bio, setBio] = useState(initialValues.bio || '');

  useEffect(() => {
    setProfession(initialValues.profession || '');
    setBio(initialValues.bio || '');
  }, [initialValues]);

  return (
    <Formik
      initialValues={{bio, profession}}
      onSubmit={(values) => {
        updateProfile(values);
      }}
      validationSchema={BioConfigSchema}
      validateOnBlur={false}
      validateOnChange={validatingRealTime}>
      {(props) => (
        <View>
          <TextInput
            multiline={true}
            numberOfLines={4}
            placeholder="Type..."
            onChangeText={(bioText) => {
              props.handleChange('bio')(bioText);
              setBio(bioText);
            }}
            defaultValue=""
            name="bio"
            value={bio}
            style={[
              styles.styledTextarea,
              props.errors.description && Inputs.inputError,
            ]}
          />
          {props.errors.bio && (
            <Text style={styles.validationError}>{props.errors.bio}</Text>
          )}
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
  buttonContainer: {
    ...Containers.itemContainer,
  },
  inputContainer: {
    ...Inputs.inputContainer,
  },
  inputLabel: {
    ...Inputs.inputLabel,
  },
  themedTextInput: {
    ...Inputs.noIconInput,
  },
  styledTextarea: {
    ...Inputs.stackedTextarea,
  },
  nextButton: {
    ...Buttons.primaryButton,
    ...Buttons.formButton,
  },
  nextButtonText: {
    ...Buttons.lightButtonText,
  },
  validationError: {
    ...Inputs.validationError,
  },
});
