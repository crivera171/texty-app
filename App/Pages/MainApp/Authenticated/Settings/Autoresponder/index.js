import React, {useContext} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Typography, Containers} from '@/Styles';
import {COLORS} from '@/Styles/colors';
import {Header} from '@/Components/Layout/Header';
import tw from 'tw';
import {createStackNavigator} from '@react-navigation/stack';
import {Icon} from 'react-native-elements';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import WelcomeMessagePage from './WelcomeMessage';
import FanOptinPage from './FanOptin';
import UnscheduledCallPage from './UnscheduledCall';
import OrderCompletePage from './OrderComplete';
import OrderRequiredPage from './OrderRequired';
import {ProfileStore} from 'State/ProfileContext';
import {pages} from './constants';

const Stack = createStackNavigator();

const Index = ({navigation}) => {
  const {state} = useContext(ProfileStore);

  return (
    <ScrollView>
      <View style={Containers.background}>
        <Header
          title="Autoresponder"
          handleBack={() => navigation.goBack()}
          hideDone
        />
        <View style={styles.container}>
          <Text style={Typography.subtitle}>
            The messages below will be automatically sent by the system
            following specific events. You may customize them with your personal
            voice, touch and brand as you see fit.
          </Text>
        </View>
        <View>
          {pages.map((link, idx) => (
            <TouchableOpacity
              style={styles.container}
              onPress={() =>
                navigation.navigate(link.key, {profile: state.profile})
              }
              key={idx}>
              <View
                style={{
                  ...tw('flex-row'),
                  width: wp(10),
                }}>
                <Icon
                  color={COLORS.blue}
                  type="font-awesome-5"
                  name={link.icon}
                  size={wp(5)}
                  solid
                />
              </View>
              <View
                style={[
                  tw('flex-1 flex-row items-center justify-between'),
                  {borderColor: COLORS.lightGray},
                ]}>
                <Text style={[Typography.subtitle, tw('text-blue')]}>
                  {link.title}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const AutoresponderPage = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="index" component={Index} />
      <Stack.Screen name="welcomeMessage" component={WelcomeMessagePage} />
      <Stack.Screen name="fanOptinMessage" component={FanOptinPage} />
      <Stack.Screen
        name="unscheduledCallMessage"
        component={UnscheduledCallPage}
      />
      <Stack.Screen name="orderCompleteMessage" component={OrderCompletePage} />
      <Stack.Screen name="orderRequiredMessage" component={OrderRequiredPage} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  background: tw('h-full bg-white'),
  container: {
    ...Containers.container,
    ...tw('flex-row justify-between items-center py-4'),
  },
});

export default AutoresponderPage;
