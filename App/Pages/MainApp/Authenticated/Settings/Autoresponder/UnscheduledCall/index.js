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
  unscheduled_call_message: Yup.string()
    .required('Enter unscheduled call message')
    .test(
      'unscheduled_call_message',
      'You can only use one {link} token in this message',
      (str) =>
        (str && str.match(/\{link\}/g) === null) ||
        (str && str.match(/\{link\}/g).length <= 1),
    ),
});

const UnscheduledCallPage = ({route, navigation}) => {
  const {profile} = route.params;
  const {actions} = useContext(ProfileStore);

  const initialValues = profile;

  const [validatingRealTime, setValidatingRealTime] = useState(false);
  const [unscheduledCallMessage, setUnscheduledCallMessage] = useState(
    initialValues.unscheduled_call_message ||
      'The number you are calling from is not associated with an order booked at this time. Please book a call at {link}',
  );
  const [loading, setLoading] = useState(false);

  const onFormSubmit = useCallback(
    ({unscheduled_call_message}) =>
      actions
        .editProfile({
          unscheduled_call_message,
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
          unscheduled_call_message: unscheduledCallMessage,
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
              title="Unscheduled Call Message"
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
                      name="calendar-times"
                      size={wp(5)}
                      style={tw('mr-2')}
                      solid
                    />
                    <Text style={Typography.subtitle}>
                      Setup unscheduled call message
                    </Text>
                  </View>
                </View>
                <Text style={styles.inputNote}>
                  This message is sent when a fan attempts to call you without
                  booking an appoinment. You can use{' '}
                  <Text style={styles.token}>{'{link}'}</Text> to insert a link
                  to your signup page.
                </Text>
                <View style={styles.inputContainer}>
                  <Input
                    multiline
                    numberOfLines={6}
                    placeholder="Unscheduled call message"
                    onChangeText={(msgVal) => {
                      setUnscheduledCallMessage(msgVal);
                      props.setFieldValue('unscheduled_call_message', msgVal);
                    }}
                    value={unscheduledCallMessage}
                    error={props.errors.unscheduled_call_message}
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

export default UnscheduledCallPage;

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
