import React, {useState} from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Text,
  StatusBar,
} from 'react-native';
import {Containers, Tabs} from 'Styles';
import {COLORS} from 'Styles/colors';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {TimeslotList} from './TimeslotListComponent';
import {AppointmentList} from './AppointmentListComponent';
import {Header} from '@/Components/Layout/Header';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {Icon} from 'react-native-elements';
import tw from 'tw';

const initialLayout = {width: Dimensions.get('window').width};

const ChatListPage = ({navigation}) => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'availability', title: 'Availability'},
    {key: 'myAppointments', title: 'My Appointments'},
  ]);

  const MyAppointments = () => (
    <View style={Containers.background}>
      <AppointmentList />
    </View>
  );

  const Availability = () => (
    <View style={Containers.background}>
      <ScrollView>
        <TimeslotList />
      </ScrollView>
    </View>
  );

  const renderScene = SceneMap({
    availability: Availability,
    myAppointments: MyAppointments,
  });

  return (
    <>
      <StatusBar translucent backgroundColor="#fff" barStyle="dark-content" />
      <Header
        hideBack
        title={routes[index].title}
        hideDone={index === 1}
        handleDone={() =>
          navigation.navigate('createTimeslotPage', {timeslot: {}})
        }
        doneTitle="Add"
        doneIcon={
          <Icon
            type="antdesign"
            name="plus"
            style={tw('pl-2')}
            size={14}
            color={COLORS.blue}
          />
        }
      />

      <TabView
        style={Containers.tabContainer}
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={(tabProps) => (
          <SafeAreaView style={Tabs.tabBarContainer}>
            <TabBar
              {...tabProps}
              renderLabel={(props) => (
                <View style={Tabs.unreadContainer}>
                  <Text style={{color: props.color, fontSize: wp(3.6)}}>
                    {props.route.title}
                  </Text>
                </View>
              )}
              indicatorStyle={Tabs.indicatorStyle}
              style={Tabs.tabBar}
              activeColor={COLORS.blue}
              inactiveColor={COLORS.black}
              labelStyle={Tabs.labelStyle}
            />
          </SafeAreaView>
        )}
      />
    </>
  );
};

export default ChatListPage;
