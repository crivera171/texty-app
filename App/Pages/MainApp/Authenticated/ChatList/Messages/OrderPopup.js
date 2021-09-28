/* eslint-disable max-lines */
import React, {useMemo, useState, useContext} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {Icon, Button} from 'react-native-elements';
import {COLORS} from 'Styles/colors.js';
import {Containers, Typography} from '@/Styles';
import {format, addHours} from 'date-fns';
import {MessageStore} from 'State/MessageContext';
import {AlertBox} from '@/Components/AlertBox';
import tw from 'tw';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {censoredPhone} from 'utils/phone';
import {Badge} from '@/Components/Badge';
import {Modal} from '@/Components/Modal';

const convertFromMicros = (p) => {
  return (p / 100).toFixed(2);
};

const itemTypes = {
  subscription: {
    label: 'Subscription',
    value: 'subscription',
    icon: 'vote-yea',
  },
  response: {
    label: 'Response',
    value: 'response',
    icon: 'comment',
  },
  call: {
    label: 'Meeting',
    value: 'call',
    icon: 'user-friends',
  },
  link: {
    label: 'Link',
    value: 'link',
    icon: 'link',
  },
  content: {
    label: 'Content',
    value: 'content',
    icon: 'file-invoice',
  },
};

export const OrderPopup = ({order, isOrderShown}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const {actions} = useContext(MessageStore);
  const [modal, setModal] = useState(false);

  const closeOrder = (actionType) => {
    if (actionType === 'danger') {
      actions.refundOrder(order.id);
    } else {
      actions.closeOrder(order.id);
    }
  };

  const getPrice = useMemo(() => {
    if (order.total === 0) {
      return 'free';
    }
    return `$${convertFromMicros(order.total)}`;
  }, [order]);

  const getName = useMemo(() => {
    return (
      order.contact_object.full_name ||
      censoredPhone(order.contact_object.phone)
    );
  }, [order]);

  const getTime = useMemo(() => {
    const convertTime = order.updated_at?.seconds * 1000 || order.updated_at;
    const time = addHours(new Date(convertTime), 0);
    return format(time, 'd MMMM uuuu | h:mm aaa O').replace('GMT', 'UTC');
  }, [order]);

  return order && isOrderShown ? (
    <View>
      <AlertBox
        visible={modal}
        onDismiss={() => setModal(false)}
        onSubmit={() => {
          closeOrder(modal);
          setModal(false);
        }}
        type={modal}
        title="Open Order"
        text={
          modal === 'danger'
            ? 'Are you sure you would like to cancel and refund this order?'
            : 'Are you sure you would like to close this order?'
        }
      />

      {isExpanded ? (
        <Modal
          title="Open Order"
          isVisible={true}
          containerStyle={tw('px-0')}
          onDismiss={() => {
            setIsExpanded(false);
          }}>
          <View style={Containers.section}>
            <View style={styles.container}>
              <View style={tw('flex-row items-center w-full justify-between')}>
                <Text style={[Typography.notice]}>{getName} purchased</Text>
                <Text style={[Typography.notice]}>{getTime}</Text>
              </View>
              <View
                style={tw('flex-row items-center w-full justify-between mt-2')}>
                <View style={tw('flex-row items-center')}>
                  <Icon
                    color={COLORS.blue}
                    name={itemTypes[order.item_type].icon}
                    size={wp(6)}
                    type="font-awesome-5"
                    solid
                    style={tw('mr-3')}
                  />
                  <Text style={Typography.title}>
                    {itemTypes[order.item_type].label}
                  </Text>
                </View>
                <Text style={Typography.title}>{getPrice}</Text>
              </View>
            </View>
          </View>

          <View
            style={tw(
              'flex-row items-center w-full justify-between mt-4 mb-2 px-5',
            )}>
            <Text style={[Typography.subtitle, tw('text-dark-gray font-bold')]}>
              Order Description
            </Text>
          </View>
          <View style={[Containers.section, tw('mt-0')]}>
            <View style={styles.container}>
              <ScrollView nestedScrollEnabled style={styles.desc}>
                {order.message_file ? (
                  <Button
                    icon={{
                      name: 'download',
                      type: 'font-awesome',
                      size: 18,
                      color: COLORS.white,
                    }}
                    buttonStyle={tw('rounded-full bg-blue')}
                    titleStyle={[Typography.notice, tw('text-white')]}
                    title={`Download attachment (${order.message_file_type})`}
                    containerStyle={tw('my-2')}
                    onPress={async () => {
                      await Linking.openURL(order.message_file);
                    }}
                  />
                ) : null}

                <Text style={Typography.notice}>{order.message}</Text>
              </ScrollView>
            </View>
          </View>
          <View style={Containers.section}>
            <View style={[styles.container, tw('py-0 px-0')]}>
              <TouchableOpacity
                onPress={() => {
                  setIsExpanded(false);
                  setModal('alert');
                }}
                style={Containers.container}>
                <Text style={[Typography.subtitle, tw('text-blue')]}>
                  Complete
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setIsExpanded(false);
                  setModal('danger');
                }}
                style={[Containers.container, tw('border-0')]}>
                <Text style={[Typography.subtitle, tw('text-red')]}>
                  Cancel and Refund
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      ) : null}

      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          setIsExpanded(true);
        }}
        style={styles.chatNavigationContainer}>
        <View style={styles.notificationInfoWrapper}>
          <View style={tw('relative')}>
            <Icon
              color={COLORS.white}
              type="font-awesome-5"
              name="shopping-bag"
              size={wp(5.5)}
            />
            <View style={styles.badge}>
              <Badge
                size={wp(4.5)}
                fontSize={wp(3)}
                number={1}
                textStyle={tw('font-bold')}
              />
            </View>
          </View>

          <Text style={[Typography.subtitle, tw('ml-4 text-white font-bold')]}>
            Open Order
          </Text>
        </View>
        <View style={tw('flex-row items-center')}>
          <Text style={[Typography.notice, tw('mr-2 font-medium text-white')]}>
            Show
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  badge: {
    ...tw('absolute'),
    bottom: 10,
    left: 13,
  },
  notificationInfoWrapper: tw('flex-1 flex-row items-center relative'),
  chatNavigationContainer: {
    ...Containers.container,
    ...tw('bg-blue flex-row py-2'),
  },
  container: {
    ...Containers.container,
    ...tw('border-0 py-2'),
  },
  orderFile: tw('flex-row'),
  desc: {
    maxHeight: 200,
  },
});
