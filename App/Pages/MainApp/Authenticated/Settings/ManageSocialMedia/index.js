import React, {useContext} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Header} from '@/Components/Layout/Header';
import {ProfileStore} from 'State/ProfileContext';
import {SocialMediaList} from '@/Components/Shared/Lists/SocialMedia';
import {Icon} from 'react-native-elements';
import {COLORS} from 'Styles/colors.js';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import tw from 'tw';
import {Containers} from '@/Styles';

const ManageSocialMediaPage = ({navigation}) => {
  const {actions: influencerActions} = useContext(ProfileStore);

  return (
    <View style={Containers.background}>
      <Header
        title="Social Media"
        handleBack={() => navigation.goBack()}
        handleDone={() =>
          navigation.navigate('createSocialMediaPage', {socialMedia: {}})
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
        loading={influencerActions.loading}
      />
      <ScrollView>
        <View style={styles.container}>
          <SocialMediaList />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...Containers.container,
    ...tw('h-full border-b-0 pt-4'),
  },
  controls: {
    width: wp(20),
  },
});

export default ManageSocialMediaPage;
