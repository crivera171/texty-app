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

const WelcomeMessageSchema = Yup.object().shape({
  welcome_message_enabled: Yup.boolean(),
  welcome_message: Yup.string().when('welcome_message_enabled', {
    is: true,
    then: Yup.string()
      .required('Enter welcome message')
      .max(1600, 'Message is too long')
      .test(
        'welcome_message',
        'You can only use one {link} token in this message',
        (str) =>
          (str && str.match(/\{link\}/g) === null) ||
          (str && str.match(/\{link\}/g).length <= 1),
      ),
  }),
});

const WelcomeMessagePage = ({route, navigation}) => {
  const {profile} = route.params;
  const {actions} = useContext(ProfileStore);

  const initialValues = profile;

  const [validatingRealTime, setValidatingRealTime] = useState(false);
  const [welcomeMessageEnabled, setWelcomeMessageEnabled] = useState(
    initialValues.welcome_message_enabled || false,
  );
  const [welcomeMessage, setWelcomeMessage] = useState(
    initialValues.welcome_message ||
      'Thanks! Make sure to add this number as a contact in your phone. Shoot me a text any time - or click here to see exclusive offers for my fans {link}',
  );

  const [loading, setLoading] = useState(false);

  const onFormSubmit = useCallback(
    ({welcome_message_enabled, welcome_message}) =>
      actions
        .editProfile({
          welcome_message_enabled,
          welcome_message,
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
          welcome_message_enabled: welcomeMessageEnabled,
          welcome_message: welcomeMessage,
        }}
        onSubmit={(data) => {
          Keyboard.dismiss();
          setLoading(true);
          onFormSubmit(data);
          setValidatingRealTime(true);
        }}
        validationSchema={WelcomeMessageSchema}
        validateOnBlur={false}
        validateOnChange={validatingRealTime}>
        {(props) => (
          <View style={styles.background}>
            <Header
              title="Welcome Message"
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
                      name="handshake"
                      size={wp(5)}
                      style={tw('mr-2')}
                      solid
                    />
                    <Text style={Typography.subtitle}>
                      Setup your welcome message
                    </Text>
                  </View>
                  <Switch
                    onValueChange={(welcomeMsgEnabledValue) => {
                      props.setFieldValue(
                        'welcome_message_enabled',
                        welcomeMsgEnabledValue,
                      );
                      setWelcomeMessageEnabled(welcomeMsgEnabledValue);
                    }}
                    name="welcome_message_enabled"
                    value={welcomeMessageEnabled}
                  />
                </View>
                {welcomeMessageEnabled ? (
                  <>
                    <Text style={styles.inputNote}>
                      This message is sent automatically after new fans accept
                      the T's & C's and become one of your official Contacts.
                      You can use <Text style={styles.token}>{'{link}'}</Text>{' '}
                      to insert a link to your profile page.
                    </Text>
                    <View style={styles.inputContainer}>
                      <Input
                        multiline
                        numberOfLines={6}
                        placeholder="Welcome message"
                        onChangeText={(welcomeMsgVal) => {
                          setWelcomeMessage(welcomeMsgVal);
                          props.setFieldValue('welcome_message', welcomeMsgVal);
                        }}
                        value={welcomeMessage}
                        error={props.errors.welcome_message}
                        maxCharacters={1600}
                      />
                    </View>
                  </>
                ) : null}
              </View>
            </KeyboardAwareScrollView>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default WelcomeMessagePage;

const styles = StyleSheet.create({
  background: tw('h-full bg-white'),
  container: tw('py-4 px-5 w-full'),
  switchContainer: {
    ...Inputs.switchContainer,
    ...tw('py-2'),
  },
  inputNote: {
    ...tw('my-3'),
    ...Typography.notice,
  },
});
