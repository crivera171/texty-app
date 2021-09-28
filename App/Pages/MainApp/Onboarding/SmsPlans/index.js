import React, {useContext, useEffect, useRef} from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import {Buttons, Containers, Typography} from '../../../../Styles';
import {ProfileStore} from 'State/ProfileContext';
import {ItemStore} from 'State/ItemContext';
import Logo from 'Assets/Images/logo.png';
import {FormButton} from '@/Components/Buttons/Button';
import {useTracker, events} from 'utils/analytics';
import {useNavigation} from '@react-navigation/native';
import {useOnbordingSteps} from 'utils/onboarding';
import {Items} from '@/Components/Shared/Lists/Items';
import {ScrollView} from 'react-native-gesture-handler';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
const SmsPlansPage = () => {
  const {nextStep} = useOnbordingSteps();
  const {actions} = useContext(ProfileStore);
  const {navigate} = useNavigation();
  const {itemActions} = useContext(ItemStore);
  const {track} = useTracker(events.onboarding_items);

  useEffect(() => {
    actions.fetchProfile();
  }, [actions.fetchProfile]);

  useEffect(() => {
    itemActions.getInfluencerItems();
  }, []);

  const scrollViewRef = useRef(null);

  return (
    <View style={styles.pageContainer}>
      <View style={styles.formContainer}>
        <View>
          <View>
            <Image style={styles.signupImageContainer} source={Logo} />
          </View>
          <View style={styles.pageTitleContainer}>
            <Text style={styles.pageTitle}>Create an Item</Text>
          </View>
          <View style={styles.pageSubtitleContainer}>
            <Text style={styles.pageSubtitle}>
              Create items for your fans to purchase.
            </Text>
          </View>
          <ScrollView ref={scrollViewRef} style={{maxHeight: hp(50)}}>
            <Items forwardedRef={scrollViewRef} />
          </ScrollView>
        </View>

        <View>
          <FormButton
            loading={itemActions.loading}
            style={styles.nextButton}
            rounded
            full
            onPress={() => {
              actions
                .editProfile({onboardingStep: nextStep, has_onboarded: false})
                .then(() => {
                  track(events.onboarding_items_submit);
                  navigate(nextStep);
                });
            }}>
            <Text style={styles.nextButtonText}>Next Step</Text>
          </FormButton>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    ...Containers.contextContainer,
  },
  formContainer: {
    ...Containers.formContainer,
  },
  pageTitleContainer: {
    ...Containers.titleContainer,
  },
  pageSubtitleContainer: {
    ...Containers.subtitleContainer,
  },
  pageTitle: {
    ...Typography.title,
  },
  pageSubtitle: {
    ...Typography.subtitle,
  },
  nextButton: {
    ...Buttons.primaryButton,
    ...Buttons.formButton,
  },
  nextButtonText: {
    ...Buttons.lightButtonText,
  },
  signupImageContainer: {
    ...Containers.logoContainer,
  },
});

export default SmsPlansPage;
