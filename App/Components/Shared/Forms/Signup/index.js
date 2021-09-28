/* eslint-disable max-lines */
import React, {useState} from 'react';
import {View, StyleSheet, Text, Keyboard, ScrollView} from 'react-native';
import {Formik} from 'formik';
import {Buttons, Typography} from '@/Styles';
import * as Yup from 'yup';
import {FormButton} from '@/Components/Buttons/Button';
import {api} from 'State/Services/api';
import {COLORS} from 'Styles/colors';
import {CheckBox} from 'react-native-elements';
import {Input} from '@/Components/Inputs/Input';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import tw from 'tw';

const SignupSchema = (setSlug) =>
  Yup.object().shape({
    name: Yup.string().required('Enter your full name'),
    email: Yup.string()
      .email('Enter a valid email address')
      .required('Enter an email address'),
    phone: Yup.string()
      .required('Enter a phone number')
      .min(17, 'Please enter a valid phone number')
      .max(17, 'Please enter a valid phone number'),
    password: Yup.string()
      .required('Enter a password')
      .min(6, 'Password is too short - should be 6 chars minimum.'),
    slug: Yup.string()
      .required('Enter your Texty link')
      .min(3, 'Custom URL is too short - should be 3 chars minimum.')
      .test('slug', 'This URL is already taken', async (value) => {
        try {
          await api.get(`/influencers/slug-validity/${value}`);
        } catch (e) {
          return false;
        }
        return true;
      }),
    terms: Yup.boolean().oneOf([true], 'Accept ToS to proceed'),
  });

export const SignupForm = ({loading, onFormSubmit}) => {
  const [validatingRealTime, setValidatingRealTime] = useState(false);
  // Run this on form submit
  const createProfile = (data) => {
    data.phone = data.phone.replace(/[^0-9.]/g, '').substring(1);
    onFormSubmit(data);
  };

  const [name, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [slug, setSlug] = useState('');
  const SignupValidationSchema = SignupSchema(setSlug);

  const [terms, setTerms] = useState(false);
  return (
    <Formik
      initialValues={{
        name,
        email,
        phone,
        password,
        slug,
        terms,
      }}
      onSubmit={(values) => {
        createProfile(values);
      }}
      enableReinitialize
      validationSchema={SignupValidationSchema}
      validateOnBlur={true}
      validateOnChange={validatingRealTime}>
      {(props) => (
        <View style={tw('h-full')}>
          <ScrollView>
            <View style={tw('p-5 flex-1')}>
              <Text style={styles.pageTitle}>Create your account</Text>

              <Input
                name="name"
                placeholder="Full Name"
                value={name}
                icon="user-alt"
                prefixStyle={styles.inputIcon}
                onChangeText={(nameText) => {
                  props.handleChange('name')(nameText);
                  setFullName(nameText);
                }}
                error={props.errors.name}
              />

              <Input
                onChangeText={(slugVal) => {
                  slugVal = slugVal
                    .replace(' ', '_')
                    .replace(/[&/\\#,+“‘;()!^@$~[\]%'":*?<>{}]/g, '');
                  props.handleChange('slug')(slugVal);
                  setSlug(slugVal);
                }}
                value={slug}
                prefix="mytexty.com/"
                error={props.errors.slug}
                placeholder="Your Texty link"
                tooltip="This will be your personal Mytexty link."
              />

              <Input
                value={email}
                keyboardType="email-address"
                placeholder="Email"
                icon="envelope"
                onChangeText={(emailText) => {
                  props.handleChange('email')(emailText);
                  setEmail(emailText);
                }}
                error={props.errors.email}
              />

              <Input
                value={phone}
                keyboardType="number-pad"
                placeholder="+1 (___) ___-____"
                icon="phone"
                onChangeText={(phoneText) => {
                  props.handleChange('phone')(phoneText);
                  setPhone(phoneText);
                }}
                error={props.errors.phone}
                mask="+1 ([000]) [000]-[0000]"
                tooltip="We need your personal cell number so we can forward text and
                phone calls."
              />
              <Input
                value={password}
                placeholder="Password"
                type="password"
                icon="lock"
                onChangeText={(passwordText) => {
                  props.handleChange('password')(passwordText);
                  setPassword(passwordText);
                }}
                error={props.errors.password}
              />

              <View style={styles.termsContainer}>
                <CheckBox
                  containerStyle={tw('py-0 border-0 bg-white')}
                  textStyle={{
                    ...tw('font-medium'),
                    fontSize: wp(3.5),
                    color: props.errors.terms ? COLORS.red : COLORS.darkGray,
                    marginVertical: hp(0.3),
                  }}
                  title="By using this form you agree with both the storage and
                  handling of your data by Texty in accordance with our Privacy
                  Policy and our Terms of Use."
                  onPress={() => {
                    props.setFieldValue('terms', !terms);
                    setTerms(!terms);
                  }}
                  checked={terms}
                />
              </View>
            </View>
          </ScrollView>
          <View style={styles.buttonContainer}>
            <View style={tw('w-1/4')}>
              <FormButton
                loading={loading}
                full
                onPress={() => {
                  if (!props.isValid) {
                    return;
                  }
                  Keyboard.dismiss();
                  props.handleSubmit();
                  setValidatingRealTime(true);
                }}
                title="Sign Up"
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
  inputIcon: {
    paddingHorizontal: 10,
  },
  nextButton: {
    ...Buttons.primaryButton,
    ...Buttons.formButton,
  },
  nextButtonText: {
    ...Buttons.lightButtonText,
  },
  termsContainer: {
    ...tw('items-center justify-center'),
  },
  terms: {
    ...Typography.subtitle,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  link: {
    color: COLORS.secondary,
  },
  buttonContainer: {
    ...tw(
      'w-full flex-row items-center justify-end border-t px-5 py-2 bg-white',
    ),
    borderColor: '#E8E8E8',
  },
});
