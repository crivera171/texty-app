import React, {useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Typography} from '@/Styles';
import {Header} from '@/Components/Layout/Header';
import tw from 'tw';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import TextyStripe from '@/Assets/Images/payment/textyStripe.png';
import {api} from 'State/Services/api.js';
import {BANK_SETUP_REDIRECT_URL} from '@/State/Constants';

const BankPage = ({route, navigation}) => {
  const {profile} = route.params;
  const [loading, setLoading] = useState(false);

  const onSetUp = () => {
    setLoading(true);
    let error = false;
    api.migrate
      .post('/influencer/payments/transfers')
      .then((response) => response.data)
      .then(({accountLinks, loginLink}) => {
        const url = (accountLinks || loginLink) ?  (accountLinks || loginLink).url : null;
        if (url) {
          // Open 3rd party url inside the app webview
          navigation.navigate('internalBrowser', {
            uri: url,
            successUrl: BANK_SETUP_REDIRECT_URL,
            successModalMsg: 'Payment settings updated!',
          });
        } else {
          error = true;
        }
      })
      .catch(() => {
        error = true;
      })
      .finally(() => {
        setLoading(false);
        if (error) {
          Alert.alert('', 'Error occurs. Please try again!', [
            {text: 'OK', onPress: () => navigation.navigate('Settings')},
          ]);
        }
      });
  };

  return (
    <View style={styles.background}>
      <Header title="Bank" handleBack={() => navigation.goBack()} hideDone />
      <View style={styles.container}>
        <Image width={wp(60.5)} source={TextyStripe} />
        <Text style={tw('mt-3')}>
          Mytexty.com Payments partners with Stripe for secure payments and
          financial services.
        </Text>
        <Text style={tw('mt-3 mb-6')}>
          You will be redirected to Stripe website to setup your payment
          details.
        </Text>
        <TouchableOpacity
          style={tw('bg-blue rounded-full py-4 w-full py-4')}
          onPress={onSetUp}>
          <Text
            style={[
              Typography.subtitle,
              tw('text-white text-center font-medium'),
            ]}>
            {loading ? 'Processing...' : 'Setup Payment Details'}
          </Text>
        </TouchableOpacity>
        <View style={tw('flex-row mt-5 rounded-md border-solid border-2 p-2')}>
          <Text>Powered by </Text>
          <Text style={tw('font-bold')}>Stripe</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: tw('h-full bg-white'),
  container: {
    ...tw('items-center'),
    marginLeft: wp(6.8),
    marginRight: wp(6.8),
    marginTop: hp(10),
  },
});

export default BankPage;
