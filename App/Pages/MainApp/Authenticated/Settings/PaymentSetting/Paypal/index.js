import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  Alert
} from 'react-native';
import { Icon } from 'react-native-elements';
import { Buffer } from 'buffer';
import tw from 'tw';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {COLORS} from 'Styles/colors.js';
import { Header } from 'Components/Layout/Header';
import { isValidEmail } from 'utils/string.js';
import { api } from 'State/Services/api.js';
import { Typography } from 'Styles/typography.js';

const PaypalPage = ({ route, navigation }) => {
  const { profile } = route.params;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState(
    profile.paypal ? Buffer.from(profile.paypal, 'base64').toString('utf-8') : ''
  );                                                                                                                                                                                                                                                                                                                                                                                                                                                               
  const [emailErr, setEmailErr] = useState('');
  const [firstVisit, setFirstVisit] = useState(true);
  const [loading, setLoading] = useState(false);

  const save = () => {
    setFirstVisit(false);
    if (!email) {
      setEmailErr('Please enter your PayPal email address.');
      return
    } else if (!isValidEmail(email)) {
      setEmailErr('Please enter correct email address.');
      return
    } else {
      setEmailErr(null);
    };
    if (!firstName || !lastName) {
      return
    };
    setLoading(true);
    let alertMessage = "Error occurs. Please try again!";
    api.migrate.post(
      '/influencer/payments/paypal', {paypal_email: email}
    )
    .then(response => response.data)
    .then(({influencer}) => {
      if (influencer) {
       alertMessage = `Success! Future payouts will be sent to ${email}`;
      };
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      setLoading(false);
      Alert.alert(
        "", alertMessage,
        [
          { text: "OK", onPress: () => navigation.navigate('Settings') }
        ]
      );
    });
  };                                                                                                                                                                                                                                                                                                                                            

  return (
    <View style={styles.background}>
      <Header
        title='PayPal'
        handleBack={() => navigation.goBack()}
        doneTitle='Save'
        handleDone={save}
        loading={loading}
      />
      <View style={styles.container}>
        <View style={styles.inputWrapper}>
          <Icon name='user-alt' type='font-awesome-5' size={wp(5)} color={COLORS.newGray} solid />              
          <TextInput
            style={styles.textInput}
            placeholder='First Name'
            onChangeText={setFirstName}
            value={firstName}
          />
        </View>
        {!firstVisit && !firstName && <Text style={tw('text-red')}>Please enter your first name</Text>}
        <View style={styles.inputWrapper}>
          <Icon name='user-alt' type='font-awesome-5' size={wp(5)} color={COLORS.newGray} solid />
          <TextInput
            style={styles.textInput}
            placeholder='Last Name'
            onChangeText={setLastName}
            value={lastName}
          />
        </View>
        {!firstVisit && !lastName && <Text style={tw('text-red')}>Please enter your last name</Text>}
        <View style={[styles.inputWrapper, tw('mt-10')]}>
          <Icon name='envelope' type='font-awesome-5' size={wp(5)} color={COLORS.newGray} solid />
          <TextInput
            style={styles.textInput}
            placeholder='example@email.com'
            onChangeText={setEmail}
            value={email}
          />
        </View>
        {!firstVisit && emailErr && <Text style={tw('text-red')}>{emailErr}</Text>}
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  background: tw('h-full bg-white'),
  container: {
    marginLeft: wp(4.4),
    marginRight: wp(4.4),
    marginTop: hp(4),
  },
  inputWrapper: {
    ...tw('flex-row rounded-md border-solid border-2 w-full items-center p-2 mt-4'),
    borderColor: '#E8E8E8',
    borderRadius: wp(2.5),
  },
  textInput: {
    ...tw('w-full h-full ml-2'),
    ...Typography.subtitle,
  },
});

export default PaypalPage;
