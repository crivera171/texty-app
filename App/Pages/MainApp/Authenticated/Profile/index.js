/* eslint-disable max-lines */
/* eslint-disable react-native/no-inline-styles */
import React, {
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Linking,
  Alert,
  TouchableWithoutFeedback,
  Animated,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import {Containers, Typography} from 'Styles';
import {ProfileStore} from 'State/ProfileContext';
import {COLORS} from 'Styles/colors.js';
import {CopyTextDisplay} from '@/Components/Shared/Data/CopyTextDisplay/index.js';
import {APP_URL} from '@/State/Constants';
import {ProfileVideoForm} from '@/Components/Shared/Forms/ProfileVideo/index.js';
import {Icon, Button} from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Items} from '@/Components/Shared/Lists/Items';
import {ScrollView} from 'react-native-gesture-handler';
import tw from 'tw';
import {Header} from '@/Components/Layout/Header';
import {Reviews} from '@/Components/Shared/Data/Reviews';
import {SocialMediaCompactList} from '@/Components/Shared/Lists/SocialMediaCompact';
import {ItemTemplatesList} from './ItemTemplates';
import {Card} from '@/Components/Cards/Card';
const ProfilePage = ({navigation}) => {
  const {state, actions} = useContext(ProfileStore);
  const translation = useRef(new Animated.Value(-100)).current;

  const [headerShown, setHeaderShown] = useState(false);

  const [showBio, setShowBio] = useState(true);

  const influencer = state.profile;

  const goToProfile = () => {
    navigation.navigate('ModifyProfilePage');
  };

  const imageSubmit = useCallback(
    ({profile_video_url}) =>
      actions.editProfile({
        profile_video_url,
      }),
    [actions.editProfile],
  );

  const scrollViewRef = useRef(null);

  const rating = useMemo(() => {
    if (state.reviews.data && state.reviews.data.length) {
      const ratingSum = state.reviews.data.reduce(
        (acc, review) => acc + review.rating,
        0,
      );
      return ratingSum / state.reviews.data.length;
    }

    return 0;
  }, [state.reviews]);

  const numberOfReviews = useMemo(() => {
    if (state.reviews.data && state.reviews.data.length) {
      return state.reviews.data.length;
    }

    return 0;
  }, [state.reviews]);

  const goToPreview = async () => {
    const url = `${APP_URL}/${influencer.slug}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Link cannot be opened: ${url}`);
    }
  };

  const navigateToWizard = () => {
    navigation.navigate('createItemPage', {});
  };

  useEffect(() => {
    Animated.timing(translation, {
      toValue: headerShown ? 0 : -100,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [headerShown]);

  return (
    <SafeAreaView style={Containers.safeAreaContainer}>
      <View>
        <Animated.View
          style={{
            transform: [{translateY: translation}],
            height: hp(7),
            ...tw('z-10 absolute top-0 right-0 left-0 bg-blue w-full'),
            top: Platform.OS === 'android' ? -StatusBar.currentHeight : 0,
          }}>
          <Header
            doneTitle="Preview"
            doneIcon={
              <Icon
                type="font-awesome-5"
                name="external-link-alt"
                style={tw('pl-2')}
                size={14}
                color={COLORS.blue}
              />
            }
            title={influencer.name}
            handleDone={goToPreview}
            hideBack
          />
        </Animated.View>
        <ScrollView
          onScroll={(event) => {
            const scrolling = event.nativeEvent.contentOffset.y;

            if (scrolling > 30) {
              setHeaderShown(true);
            } else {
              setHeaderShown(false);
            }
          }}
          // onScroll will be fired every 16ms
          scrollEventThrottle={16}
          ref={scrollViewRef}
          style={Containers.background}>
          <View style={tw('relative')}>
            <View style={[tw('w-full z-30')]}>
              <View
                style={{
                  ...tw('w-full bg-blue'),
                  height: hp(5),
                }}
              />
              <View
                style={[
                  styles.pageContainer,
                  tw('flex-row w-full items-center justify-between flex-wrap'),
                  {
                    marginTop: -hp(5),
                  },
                ]}>
                <View style={tw('w-full flex-row items-end justify-between')}>
                  <ProfileVideoForm
                    onFormSubmit={imageSubmit}
                    initialValues={influencer}
                  />

                  <View style={tw('flex-row justify-between pb-4')}>
                    <Button
                      onPress={goToPreview}
                      icon={
                        <Icon
                          type="font-awesome-5"
                          name="external-link-alt"
                          style={tw('pr-2')}
                          size={18}
                          color={COLORS.blue}
                        />
                      }
                      title="Preview"
                      type="outline"
                      titleStyle={tw('text-blue')}
                      buttonStyle={tw('py-1 px-3')}
                      containerStyle={tw(
                        'rounded-full border-2 border-blue mr-1',
                      )}
                    />
                    <Button
                      onPress={goToProfile}
                      icon={
                        <Icon
                          type="font-awesome-5"
                          name="cog"
                          style={tw('pr-2')}
                          size={18}
                          color={COLORS.blue}
                        />
                      }
                      title="Edit"
                      type="outline"
                      titleStyle={tw('text-blue')}
                      buttonStyle={tw('py-1 px-3')}
                      containerStyle={tw('rounded-full border-2 border-blue')}
                    />
                  </View>
                </View>
                <View style={tw('w-full')}>
                  <View style={tw('mt-2')}>
                    <Text numberOfLines={1} style={Typography.title}>
                      {influencer.name}
                    </Text>
                    <Text numberOfLines={1} style={Typography.subtitle}>
                      @{influencer.slug}
                    </Text>
                  </View>
                  <View style={tw('mt-2 flex-row flex-wrap w-full')}>
                    <Text
                      style={{
                        ...Typography.subtitle,
                        ...tw('flex-wrap'),
                      }}
                      numberOfLines={showBio ? 2 : 0}>
                      {influencer.bio}
                    </Text>
                    {influencer.bio?.length > 79 ? (
                      <TouchableWithoutFeedback
                        onPress={() => setShowBio(!showBio)}>
                        <Text style={[Typography.notice, tw('text-blue')]}>
                          Show {showBio ? 'more' : 'less'}
                        </Text>
                      </TouchableWithoutFeedback>
                    ) : null}
                  </View>
                  <View style={tw('w-full flex-row justify-between py-3')}>
                    <CopyTextDisplay
                      icon="mobile-alt"
                      formatAsPhone
                      text={influencer.twilio_phone_number}
                      containerStyle={{marginRight: wp(2)}}
                    />
                    <CopyTextDisplay
                      icon="link"
                      text={
                        influencer.slug
                          ? `${APP_URL}/${influencer.slug}`
                          : `${APP_URL}/influencers/${influencer.influencer_id}`
                      }
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View
            style={[styles.pageContainer, tw('flex flex-row justify-between')]}>
            {!state.loading ? (
              <View style={tw('flex flex-row items-center')}>
                <Reviews rating={rating} />
                <Text style={[Typography.notice, tw('ml-2')]}>
                  {numberOfReviews} Reviews
                </Text>
              </View>
            ) : (
              <ActivityIndicator color={COLORS.blue} />
            )}
            <View
              style={tw('flex-row items-center justify-center flex-wrap px-3')}>
              <Icon
                type="ionicon"
                color={COLORS.darkGray}
                size={wp(5)}
                name="time-sharp"
                style={tw('mr-1')}
              />
              <Text style={Typography.notice}>
                Responds in {influencer.avg_response_time} hour
                {influencer.avg_response_time === 1 ? ' ' : 's'}
              </Text>
            </View>
          </View>

          <ItemTemplatesList />

          <View style={[styles.pageContainer, tw('pt-6')]}>
            <Card
              disabled
              title="Create Custom Item"
              btnTitle="Add item"
              hasBtn
              onBtnPress={navigateToWizard}
              containerStyle={{
                borderStyle: 'dashed',
                borderColor: COLORS.blue,
              }}
              borderColor={COLORS.blue}
              renderIcon={
                <Icon
                  color={COLORS.blue}
                  size={24}
                  type="font-awesome-5"
                  name={'vote-yea'}
                  style={styles.planIcon}
                  solid
                />
              }
              description="Select product type, add description and set the price."
            />
          </View>

          <Items forwardedRef={scrollViewRef} />

          <View
            style={[
              styles.pageContainer,
              tw('py-5 mb-12 justify-center items-center'),
            ]}>
            {influencer.influencer_id ? (
              <SocialMediaCompactList id={influencer.influencer_id} />
            ) : (
              <ActivityIndicator size="large" color={COLORS.blue} />
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    ...Containers.container,
  },
  sectionTitle: {
    ...Typography.title,
    marginVertical: 15,
  },
  pageSubtitle: {
    ...Typography.subtitle,
    color: COLORS.white,
  },
  link: {
    ...Typography.subtitle,
    fontSize: wp(3.5),
    color: COLORS.newDarkGray,
  },
  editIcon: {
    color: COLORS.white,
    fontSize: 20,
  },
});

export default ProfilePage;
