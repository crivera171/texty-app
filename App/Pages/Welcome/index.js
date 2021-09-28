import React from 'react';
import {
  View,
  Text,
  StatusBar,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {COLORS} from '@/Styles/colors.js';
import tw from 'tw';
import Logo from 'Assets/Images/logoText.png';
import {Typography} from 'Styles';
import {Button} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

const WelcomePage = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={tw('bg-blue h-full')}>
      <StatusBar translucent backgroundColor={COLORS.blue} />
      <View style={tw('h-full w-full items-center px-8 justify-between')}>
        <View style={tw('flex-1 justify-center')}>
          <Image source={Logo} />
        </View>
        <View style={tw('w-full justify-center')}>
          <Text
            style={[
              Typography.title,
              tw('font-medium text-white text-center'),
            ]}>
            Turn your fan messages into
            <Text style={tw('font-bold')}> Big Business</Text>
          </Text>
          <Button
            onPress={() => navigation.navigate('signup')}
            title="Create an account"
            titleStyle={styles.btnTextStyle}
            disabledStyle={tw('bg-blue')}
            buttonStyle={tw('py-4 px-3 bg-white')}
            containerStyle={tw(
              'rounded-full border-2 border-white bg-white mr-1 w-full mt-8',
            )}
          />
        </View>
        <View style={tw('flex-1 justify-center')}>
          <Text style={[Typography.subtitle, tw('text-white text-center')]}>
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('login')}>
            <Text
              style={[styles.btnTextStyle, tw('text-white font-bold mt-4')]}>
              Log In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  btnTextStyle: {
    ...tw('text-blue  text-center font-medium '),
    fontSize: wp(5.3),
  },
});

export default WelcomePage;
