import React, { useContext } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';
import {Header} from '@/Components/Layout/Header';
import tw from 'tw';
import {createStackNavigator} from '@react-navigation/stack';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { ProfileStore } from 'State/ProfileContext';
import Bank from 'Assets/Images/payment/bank.png';
import { COLORS } from 'Styles/colors.js';
import { Typography } from 'Styles/typography.js'
import Paypal from 'Assets/Images/payment/paypal.png';
import BankPage from './Bank';
import PaypalPage from './Paypal';

const Stack = createStackNavigator();

const rows = [
  {
    icon: Bank,
    name: 'Bank',
    type: 'stripe',
  },
  {
    icon: Paypal,
    name: 'PayPal',
    type: 'paypal',
  },
];

const Index = ({ navigation }) => {
  const { state } = useContext(ProfileStore);
  return (
    <View style={styles.background}>
      <Header
        title="Select a payment method"
        titleNumberLine={2}
        handleBack={() => navigation.goBack()}
        doneTitle='Done'
        handleDone={() => navigation.goBack()}
      />
      {rows.map((row, id) => {
        return (
          <View style={styles.row} key={id}>
            <View style={tw('flex-row items-center')}>
              <View style={{width: wp(5.4)}}>
                {state.profile.payout_type === row.type && (
                  <Icon
                    color={COLORS.blue}
                    type="font-awesome-5"
                    name={'check'}
                    size={wp(5.4)}
                    solid
                  />
                )}
              </View>
              <Image source={row.icon} style={styles.image} />
              <Text style={Typography.subtitle}>{row.name}</Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(row.name.toLocaleLowerCase(), {
                  profile: state.profile,
                })
              }>
              <Text style={[Typography.subtitle, tw('text-blue')]}>Setup</Text>
            </TouchableOpacity>
          </View>
        );
      })}

    </View>
  )
};

const PaymentSettingsPage = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="index" component={Index} />
      <Stack.Screen name="bank" component={BankPage} />
      <Stack.Screen name="paypal" component={PaypalPage} />
    </Stack.Navigator>
  )
};

const styles = StyleSheet.create({
  background: tw('h-full bg-white'),
  row: {
    ...tw('flex-row items-center justify-between px-4 py-4'),
    borderBottomWidth: 1,
    borderColor: COLORS.gray,
  },
  image: {
    width: wp(6.4),
    height: wp(6.4),
    ...tw('ml-4 mr-2')
  },
});

export default PaymentSettingsPage;
