import React, {useCallback} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import tutorialWelcome from 'Assets/Images/tutorialWelcome.png';
import tutorialSecondNumber from 'Assets/Images/tutorialSecondNumber.png';
import tutorialMakeMoney from 'Assets/Images/tutorialMakeMoney.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COLORS} from 'Styles/colors.js';
import {events, useTracker} from 'utils/analytics';
import {useNavigation} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import tw from 'tw';
import Carousel from 'react-native-snap-carousel';

const slides = [
  {
    image: tutorialWelcome,
    title: 'Welcome to Texty!',
    desc: 'Let’s turn your free followers into Paid \n Customers',
  },
  {
    image: tutorialSecondNumber,
    title: 'Get Your 2nd Phone Number',
    desc: 'Interact with your fans 1:1 via SMS',
  },
  {
    image: tutorialMakeMoney,
    title: 'So many ways to make \n money with Texty',
    desc:
      'Sell 1:1 coaching, Offer monthly subscriptions, Sell phone/text/video calls, Send unlockable content',
  },
];

const TutorialPage = () => {
  const {track} = useTracker(events.tutorial_get_started);
  const {navigate} = useNavigation();
  const finishOnboarding = useCallback(async () => {
    try {
      await AsyncStorage.setItem('TUTORIAL_COMPLETE', 'true');
      navigate('welcome');
    } catch (e) {
      // saving error
    }
  }, [navigate]);

  const skip = useCallback(() => {
    track(events.tutorial_skip);
    finishOnboarding();
  });

  const _renderItem = ({item, index}) => {
    return (
      <SafeAreaView style={tw('bg-white h-full')}>
        <StatusBar translucent backgroundColor={COLORS.white} />
        <View key={index} style={styles.slideContainer}>
          <View style={styles.tutorialHelpText}>
            <Text style={styles.tutorialTitle}>{item.title}</Text>
            <Text style={styles.tutorialSubText}>{item.desc}</Text>
          </View>
          <View style={styles.tutorialImageContainer}>
            <Image style={styles.tutorialImage} source={item.image} />
          </View>
          <View
            style={{
              backgroundColor: COLORS.white,
            }}>
            <View
              style={{
                ...tw('flex-row flex-wrap items-center justify-center py-4'),
              }}>
              {[...Array(3)].map((x, id) => (
                <View
                  key={id}
                  style={{
                    backgroundColor:
                      id === index ? COLORS.blue : COLORS.darkGray,
                    ...styles.dot,
                  }}
                />
              ))}
              <TouchableOpacity
                onPress={skip}
                style={{
                  ...tw('w-full items-center'),
                }}>
                <Text style={{...tw('text-blue text-lg mt-2')}}>Skip</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  };

  return (
    <Carousel
      data={slides}
      renderItem={_renderItem}
      sliderWidth={wp(100)}
      itemWidth={wp(100)}
    />
  );
};

const styles = StyleSheet.create({
  tutorialImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  tutorialImageContainer: {
    ...tw('items-center flex-1'),
    width: '100%',
    overflow: 'hidden',
  },
  slideContainer: {
    ...tw('items-center flex-col h-full'),
    backgroundColor: COLORS.white,
    paddingVertical: hp(2),
  },
  tutorialTitle: {
    fontSize: wp(6),
    ...tw('text-center font-bold'),
    color: '#333333',
    marginTop: hp(2),
  },
  tutorialSubText: {
    fontSize: wp(4),
    marginTop: hp(1),
    ...tw('text-center'),
    color: '#666666',
  },
  tutorialHelpText: {
    ...tw('z-10'),
  },
  dot: {
    width: 13,
    height: 13,
    borderRadius: 13,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
});

export default TutorialPage;
