/* eslint-disable react-native/no-inline-styles */
import React, {
  useContext,
  useCallback,
  useEffect,
  useState,
  useRef,
} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import {COLORS} from '@/Styles/colors.js';
import {Typography, Containers} from 'Styles';
import tw from 'tw';
import {Card} from '@/Components/Cards/Card';
import {Icon} from 'react-native-elements';
import {ItemStore} from 'State/ItemContext';
import {useNavigation} from '@react-navigation/native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

const ItemIcons = {
  subscription: 'vote-yea',
  call: 'user-friends',
  response: 'comment',
  link: 'link',
  content: 'file-invoice',
};

export const ItemTemplatesList = () => {
  const {itemState, itemActions} = useContext(ItemStore);
  const [loading, setLoading] = useState({});
  const {navigate} = useNavigation();
  const [hideRecommended, setHideRecommended] = useState(false);
  const rotation = useRef(new Animated.Value(0)).current;
  const createFromTemplate = useCallback(
    (template) => {
      setLoading({...loading, [template.id]: true});
      itemActions.createFromTemplate(template.id).then((val) => {
        setLoading({...loading, [template.id]: false});
        if (val) {
          navigate('createItemPage', {
            itemToEdit: val,
          });
        }
      });
    },
    [itemActions.createFromTemplate, itemActions.getInfluencerItems],
  );

  useEffect(() => {
    Animated.timing(rotation, {
      toValue: hideRecommended ? -180 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [hideRecommended]);

  return (
    <>
      {itemState.itemTemplates.length ? (
        <View>
          <View style={[styles.pageContainer, tw('py-8')]}>
            <Text style={styles.pageTitle}>
              Create your first Item or pick from recommended items for you.
            </Text>

            <Text style={[Typography.subtitle, tw('mt-4')]}>
              Offer something else to your fans! Connect to people on a new
              level and earn money.
            </Text>
          </View>

          <TouchableWithoutFeedback
            onPress={() => setHideRecommended(!hideRecommended)}>
            <View
              style={[
                styles.pageContainer,
                tw('py-2 justify-between flex-row items-center bg-light-gray'),
              ]}>
              <Text style={[styles.sectionTitle, tw('text-left')]}>
                Recommended Items
              </Text>
              <Animated.View
                style={{
                  transform: [
                    {
                      rotate: rotation.interpolate({
                        inputRange: [0, 180],
                        outputRange: ['180deg', '0deg'],
                      }),
                    },
                  ],
                }}>
                <Icon
                  type="font-awesome-5"
                  color={COLORS.gray}
                  size={wp(5)}
                  name="chevron-down"
                  style={tw('mr-1')}
                />
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
          {hideRecommended ? null : (
            <View
              style={[
                styles.pageContainer,
                {backgroundColor: '#F8F8F8'},
                tw('py-5 justify-between flex-row'),
              ]}>
              <View style={tw('w-full flex-1')}>
                {itemState.itemTemplates.map((template, idx) => (
                  <Card
                    key={idx}
                    loading={loading[template.id]}
                    disabled
                    onBtnPress={() => createFromTemplate(template)}
                    title={template.template_name}
                    btnTitle="Add this item"
                    hasBtn
                    containerStyle={{borderStyle: 'dashed'}}
                    renderIcon={
                      <Icon
                        color={COLORS.blue}
                        size={24}
                        type="font-awesome-5"
                        name={ItemIcons[template.product_type]}
                        style={styles.planIcon}
                        solid
                      />
                    }
                    description={template.description}
                  />
                ))}
              </View>
            </View>
          )}
        </View>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    ...Typography.title,
    marginVertical: 15,
  },
  pageContainer: Containers.container,
  pageTitle: Typography.title,
  pageSubtitle: {
    ...Typography.subtitle,
    color: COLORS.white,
  },
});
