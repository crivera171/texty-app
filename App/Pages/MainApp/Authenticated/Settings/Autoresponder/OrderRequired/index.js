/* eslint-disable max-lines */
import React, {useState, useCallback, useContext} from 'react';
import {Keyboard, View, StyleSheet, Text, Switch} from 'react-native';
import {Formik} from 'formik';
import {Inputs, Typography} from '@/Styles';
import {COLORS} from '@/Styles/colors';
import * as Yup from 'yup';
import {Header} from '@/Components/Layout/Header';
import {ProfileStore} from 'State/ProfileContext';
import {Input} from '@/Components/Inputs/Input';
import tw from 'tw';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Icon} from 'react-native-elements';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

const AutoresponderSchema = Yup.object().shape({
  order_required_message_enabled: Yup.boolean(),
  order_required_message_props: Yup.object().when(
    'order_required_message_enabled',
    {
      is: true,
      then: Yup.object()
        .test(
          'order_required_message_props',
          'Enter your order required message',
          (obj) => obj.message.length > 0,
        )
        .test(
          'order_required_message_props',
          'You can only use one {link} token in this message',
          (obj) =>
            obj.message.match(/\{link\}/g) === null ||
            obj.message.match(/\{link\}/g).length <= 1,
        ),
    },
  ),
});

const OrderRequiredPage = ({route, navigation}) => {
  const {profile} = route.params;
  const {actions} = useContext(ProfileStore);

  const initialValues = profile;

  const [validatingRealTime, setValidatingRealTime] = useState(false);
  const [orderRequiredMsgEnabled, setOrderRequiredMsgEnabled] = useState(
    initialValues.order_required_message_enabled || false,
  );
  const [orderRequiredMsgProps, setOrderRequiredMsgProps] = useState(
    JSON.parse(initialValues.order_required_message_props || null) || {
      fans: true,
      customers: true,
      subscribers: true,
      message:
        '{name} is not accepting messages right now. Please purchase an order from {link}.',
    },
  );
  const [loading, setLoading] = useState(false);

  const onFormSubmit = useCallback(
    ({order_required_message_enabled, order_required_message_props}) =>
      actions
        .editProfile({
          order_required_message_enabled,
          order_required_message_props,
        })
        .then(() => {
          actions.fetchProfile();
          navigation.goBack();
        }),
    [actions.editProfile, actions.fetchProfile],
  );

  return (
    <View style={styles.pageContainer}>
      <Formik
        initialValues={{
          order_required_message_enabled: orderRequiredMsgEnabled,
          order_required_message_props: orderRequiredMsgProps,
        }}
        onSubmit={(data) => {
          Keyboard.dismiss();
          setLoading(true);
          onFormSubmit(data);
          setValidatingRealTime(true);
        }}
        validationSchema={AutoresponderSchema}
        validateOnBlur={false}
        validateOnChange={validatingRealTime}>
        {(props) => (
          <View style={styles.background}>
            <Header
              title="Order Required Message"
              doneTitle="Save"
              handleBack={() => navigation.goBack()}
              handleDone={() => {
                props.handleSubmit();
              }}
              loading={loading}
            />
            <KeyboardAwareScrollView>
              <View style={styles.container}>
                <View style={styles.switchContainer}>
                  <View style={tw('flex-row items-center')}>
                    <Icon
                      color={COLORS.darkGray}
                      type="font-awesome-5"
                      name="comment-dollar"
                      size={wp(5)}
                      style={tw('mr-2')}
                      solid
                    />
                    <Text style={Typography.subtitle}>
                      Setup order required message
                    </Text>
                  </View>
                  <Switch
                    onValueChange={(orderRequiredMsgEnabledValue) => {
                      props.setFieldValue(
                        'order_required_message_enabled',
                        orderRequiredMsgEnabledValue,
                      );
                      setOrderRequiredMsgEnabled(orderRequiredMsgEnabledValue);
                    }}
                    name="order_required_message_enabled"
                    value={orderRequiredMsgEnabled}
                  />
                </View>
                <Text style={styles.inputNote}>
                  This message is sent automatically when contact messages you
                  without an open order. You can use{' '}
                  <Text style={styles.token}>{'{link}'}</Text> to insert a link
                  to your signup page and{' '}
                  <Text style={styles.token}>{'{name}'}</Text> to insert your
                  name
                </Text>
                <View style={styles.inputContainer}>
                  <Input
                    multiline
                    numberOfLines={6}
                    placeholder="Order complete message"
                    onChangeText={(msgVal) => {
                      props.setFieldValue('order_required_message_props', {
                        ...orderRequiredMsgProps,
                        message: msgVal,
                      });
                      setOrderRequiredMsgProps({
                        ...orderRequiredMsgProps,
                        message: msgVal,
                      });
                    }}
                    value={orderRequiredMsgProps.message}
                    error={props.errors.order_required_message_props}
                    maxCharacters={1600}
                  />
                  <Text style={[Typography.notice, tw('mt-5 mb-2')]}>
                    You can block this message for certain types of users using
                    the toggles below:
                  </Text>
                </View>
                <View style={styles.switchContainer}>
                  <Text style={Typography.subtitle}>Fans</Text>
                  <Switch
                    onValueChange={(fansValue) => {
                      props.setFieldValue('order_required_message_props', {
                        ...orderRequiredMsgProps,
                        fans: fansValue,
                      });
                      setOrderRequiredMsgProps({
                        ...orderRequiredMsgProps,
                        fans: fansValue,
                      });
                    }}
                    value={orderRequiredMsgProps.fans}
                  />
                </View>

                <View style={styles.switchContainer}>
                  <Text style={Typography.subtitle}>Customers</Text>
                  <Switch
                    onValueChange={(customersValue) => {
                      props.setFieldValue('order_required_message_props', {
                        ...orderRequiredMsgProps,
                        customers: customersValue,
                      });
                      setOrderRequiredMsgProps({
                        ...orderRequiredMsgProps,
                        customers: customersValue,
                      });
                    }}
                    value={orderRequiredMsgProps.customers}
                  />
                </View>

                <View style={styles.switchContainer}>
                  <Text style={Typography.subtitle}>Subscribers</Text>
                  <Switch
                    onValueChange={(subscribersValue) => {
                      props.setFieldValue('order_required_message_props', {
                        ...orderRequiredMsgProps,
                        subscribers: subscribersValue,
                      });
                      setOrderRequiredMsgProps({
                        ...orderRequiredMsgProps,
                        subscribers: subscribersValue,
                      });
                    }}
                    value={orderRequiredMsgProps.subscribers}
                  />
                </View>
              </View>
            </KeyboardAwareScrollView>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default OrderRequiredPage;

const styles = StyleSheet.create({
  background: tw('h-full bg-white'),
  container: tw('py-4 px-5 w-full'),
  switchContainer: {...Inputs.switchContainer, ...tw('py-2')},
  inputNote: {...tw('text-black my-3'), ...Typography.notice},
  token: tw('text-blue p-3'),
});
