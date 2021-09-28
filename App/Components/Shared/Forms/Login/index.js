import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Keyboard,
  Linking,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Formik} from 'formik';
import {Inputs, Buttons, Typography} from '../../../../Styles';
import * as Yup from 'yup';
import {FormButton} from '@/Components/Buttons/Button';
import {APP_URL} from '@/State/Constants';
import {Input} from '@/Components/Inputs/Input';
import tw from 'tw';
const goToPasswordReset = async () => {
  const url = `${APP_URL}/password-reset`;
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
  } else {
    Alert.alert(`Don't know how to open this URL: ${url}`);
  }
};

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Enter a valid email address')
    .required('Enter your email address'),
  password: Yup.string()
    .min(6, 'Password is too short - should be 6 chars minimum.')
    .required('Enter your password'),
});

const LoginText = 'Log In';

export const LoginForm = ({loading, onFormSubmit}) => {
  const loginAttempt = (vals) => {
    onFormSubmit(vals);
  };

  const [validatingRealTime, setValidatingRealTime] = useState(false);

  return (
    <Formik
      initialValues={{email: '', password: ''}}
      onSubmit={loginAttempt}
      validationSchema={LoginSchema}
      validateOnBlur={false}
      validateOnChange={validatingRealTime}>
      {(props) => (
        <View style={tw('h-full')}>
          <View style={tw('p-5 flex-1')}>
            <Text style={styles.pageTitle}>Log in to Texty</Text>

            <Input
              keyboardType="email-address"
              placeholder="Email"
              icon="envelope"
              onChangeText={props.handleChange('email')}
              error={props.errors.email}
            />

            <Input
              placeholder="Password"
              type="password"
              icon="lock"
              onChangeText={props.handleChange('password')}
              error={props.errors.password}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={goToPasswordReset}>
              <Text style={styles.pwResetText}>Forgot Password?</Text>
            </TouchableOpacity>

            <View style={tw('w-1/4')}>
              <FormButton
                loading={loading}
                full
                onPress={() => {
                  Keyboard.dismiss();
                  props.handleSubmit();
                  setValidatingRealTime(true);
                }}
                title={LoginText}
              />
            </View>
          </View>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  pageTitle: {
    ...Typography.title,
    ...tw('text-left mb-3'),
  },
  validationError: {
    ...Inputs.validationError,
  },
  buttonContainer: {
    ...tw(
      'w-full flex-row items-center justify-between border-t px-5 py-2 bg-white',
    ),
    borderColor: '#E8E8E8',
  },
  inputWrapper: {
    ...Inputs.inputContainer,
  },
  inputStyle: {
    ...Typography.subtitle,
  },
  inputIcon: {
    paddingHorizontal: 10,
  },
  inputIconRight: {
    ...Inputs.inputIconRight,
  },
  inputLabel: {
    ...Inputs.inputLabel,
  },
  loginButton: {
    ...Buttons.primaryButton,
    ...Buttons.formButton,
  },
  loginButtonText: {
    ...Buttons.lightButtonText,
  },
  pwResetText: {
    ...Typography.subtitle,
    ...tw('text-blue'),
  },
});
