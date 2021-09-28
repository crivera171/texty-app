import React, {useState, useCallback, useContext} from 'react';
import {Keyboard, View, StyleSheet, Text} from 'react-native';
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
  order_complete_message: Yup.string()
    .required('Enter order complete message')
    .test(
      'order_complete_message',
      'You can only use one {link} token in this message',
      (str) =>
        (str && str.match(/\{link\}/g) === null) ||
        (str && str.match(/\{link\}/g).length <= 1),
    ),
});

const OrderCompletePage = ({route, navigation}) => {
  const {profile} = route.params;
  const {actions} = useContext(ProfileStore);

  const initialValues = profile;

  const [validatingRealTime, setValidatingRealTime] = useState(false);
  const [orderCompleteMsg, setOrderCompleteMsg] = useState(
    initialValues.order_complete_message ||
      'Thank you for your order. To place another order, visit my profile here: {link}',
  );
  const [loading, setLoading] = useState(false);

  const onFormSubmit = useCallback(
    ({order_complete_message}) =>
      actions
        .editProfile({
          order_complete_message,
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
          order_complete_message: orderCompleteMsg,
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
              title="Order Complete Message"
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
                      name="calendar-check"
                      size={wp(5)}
                      style={tw('mr-2')}
                      solid
                    />
                    <Text style={Typography.subtitle}>
                      Setup order complete message
                    </Text>
                  </View>
                </View>

                <Text style={styles.inputNote}>
                  This message is sent when a fan’s order is completed. You can
                  use
                  <Text style={styles.token}> {'{link}'}</Text> to insert a link
                  to your signup page.
                </Text>
                <View style={styles.inputContainer}>
                  <Input
                    multiline
                    numberOfLines={6}
                    placeholder="Order complete message"
                    onChangeText={(msgVal) => {
                      setOrderCompleteMsg(msgVal);
                      props.setFieldValue('order_complete_message', msgVal);
                    }}
                    value={orderCompleteMsg}
                    error={props.errors.order_complete_message}
                    maxCharacters={1600}
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

export default OrderCompletePage;

const styles = StyleSheet.create({
  background: tw('h-full bg-white'),
  container: tw('py-4 px-5 w-full'),
  switchContainer: {
    ...Inputs.switchContainer,
    ...tw('py-2'),
  },
  inputNote: {
    ...tw('text-black my-3'),
    ...Typography.notice,
  },
  token: {
    color: COLORS.blue,
    padding: 8,
  },
});
