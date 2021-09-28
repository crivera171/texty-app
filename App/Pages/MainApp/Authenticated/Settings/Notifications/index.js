import React, {useEffect, useState, useCallback, useContext} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Switch,
  ScrollView,
  TouchableWithoutFeedback,
  Linking,
} from 'react-native';
import {Formik} from 'formik';
import {Containers, Inputs, Typography} from '@/Styles';
import {COLORS} from '@/Styles/colors';
import {Header} from '@/Components/Layout/Header';
import {ProfileStore} from 'State/ProfileContext';
import {checkNotifications} from 'react-native-permissions';
import {Icon} from 'react-native-elements';
import tw from 'tw';

const NotificationsForm = ({onFormSubmit, initialValues, onDismiss}) => {
  const [pushNoticeNewOrders, setPushNoticeNewOrders] = useState(
    initialValues.push_notice_new_orders,
  );
  const [pushNoticeNewMessages, setPushNoticeNewMessages] = useState(
    initialValues.push_notice_new_messages,
  );

  const [isPermitted, setIsPermitted] = useState(false);

  useEffect(() => {
    checkNotifications().then(({status}) => {
      setIsPermitted(status === 'granted');
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      checkNotifications().then(({status}) => {
        setIsPermitted(status === 'granted');
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const requestPermission = async () => {
    await Linking.openURL('app-settings:');
  };

  const [isUpdating, setIsUpdating] = useState(false);
  return (
    <Formik
      onSubmit={onFormSubmit}
      initialValues={{
        push_notice_new_orders: pushNoticeNewOrders,
        push_notice_new_messages: pushNoticeNewMessages,
      }}
      validateOnBlur={false}
      validateOnChange={false}>
      {(props) => (
        <View style={Containers.background}>
          <Header
            title="Notifications"
            handleBack={onDismiss}
            handleDone={() => {
              props.handleSubmit();
              setIsUpdating(true);
            }}
            loading={isUpdating}
          />
          <View style={tw('h-full')}>
            {isPermitted ? (
              <View>
                <View style={styles.container}>
                  <Text style={styles.inputNote}>Notify me about</Text>
                </View>
                <View style={styles.container}>
                  <View style={styles.switchContainer}>
                    <Text style={styles.inputLabel}>New Orders</Text>
                    <Switch
                      onValueChange={(newOrdersValue) => {
                        props.setFieldValue(
                          'push_notice_new_orders',
                          newOrdersValue,
                        );
                        setPushNoticeNewOrders(newOrdersValue);
                      }}
                      name="push_notice_new_orders"
                      value={pushNoticeNewOrders}
                    />
                  </View>
                </View>
                <View style={styles.container}>
                  <View style={styles.switchContainer}>
                    <Text style={styles.inputLabel}>New Messages</Text>
                    <Switch
                      onValueChange={(newMessagesValue) => {
                        props.setFieldValue(
                          'push_notice_new_messages',
                          newMessagesValue,
                        );
                        setPushNoticeNewMessages(newMessagesValue);
                      }}
                      name="push_notice_new_messages"
                      value={pushNoticeNewMessages}
                    />
                  </View>
                </View>
              </View>
            ) : (
              <View>
                <View style={styles.container}>
                  <View style={tw('flex-row items-center')}>
                    <Icon
                      color={COLORS.red}
                      name="exclamation-circle"
                      type="font-awesome-5"
                      style={tw('pr-2')}
                    />
                    <Text style={styles.inputNote}>Turn ON Notifications</Text>
                  </View>
                  <View>
                    <Text style={[Typography.subtitle, tw('mt-2')]}>
                      Don't miss important messages from your fans and
                      customers.
                    </Text>
                  </View>
                </View>
                <View style={styles.container}>
                  <TouchableWithoutFeedback onPress={requestPermission}>
                    <View style={tw('flex-row justify-between')}>
                      <Text style={[styles.inputLabel, styles.link]}>
                        Turn ON in Settings
                      </Text>
                      <Icon
                        color={COLORS.blue}
                        name="ios-chevron-forward"
                        type="ionicon"
                      />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            )}
          </View>
        </View>
      )}
    </Formik>
  );
};

const NotificationsPage = ({route, navigation}) => {
  const {profile} = route.params;
  const {actions} = useContext(ProfileStore);

  const onFormSubmit = useCallback(
    ({push_notice_new_orders, push_notice_new_messages}) =>
      actions
        .editProfile({
          push_notice_new_orders,
          push_notice_new_messages,
        })
        .then(() => {
          navigation.goBack();
        }),
    [actions.editProfile],
  );

  return (
    <View>
      <ScrollView>
        <NotificationsForm
          onDismiss={() => navigation.goBack()}
          onFormSubmit={onFormSubmit}
          initialValues={profile}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...Containers.container,
    ...tw('py-4'),
  },
  inputLabel: {
    ...Typography.subtitle,
  },
  inputNote: {
    ...Typography.title,
  },
  link: tw('text-blue'),
  switchContainer: {
    ...Inputs.switchContainer,
    ...tw('py-0'),
  },
});

export default NotificationsPage;
