import React, {useMemo, useEffect, useState, useContext} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Keyboard,
} from 'react-native';
import {Formik} from 'formik';
import {Typography, Containers} from '@/Styles';
import {COLORS} from '@/Styles/colors';
import * as Yup from 'yup';
import {Header} from '@/Components/Layout/Header';
import {ProfileStore} from 'State/ProfileContext';
import tw from 'tw';
import {AlertBox} from '@/Components/AlertBox';
import {Input} from 'Components/Inputs/Input';
import {Icon} from 'react-native-elements';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {
  GOOGLE_AUTH_SETUP_REDIRECT_URL_SUCCESS,
  GOOGLE_AUTH_SETUP_REDIRECT_URL_FAILURE,
} from 'State/Constants';

const ct = require('countries-and-timezones');

const CallSchema = Yup.object().shape({
  timezone: Yup.string().required('Cannot be blank'),
});

const CallSchedulingForm = ({
  onFormSubmit,
  initialValues,
  onDismiss,
  errors,
  navigation,
}) => {
  const [validatingRealTime, setValidatingRealTime] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const {actions} = useContext(ProfileStore);

  const [showResults, setShowResults] = useState(false);

  const timezones = useMemo(() => {
    const initialTimezones = ct.getAllTimezones();
    for (const tz in initialTimezones) {
      const name = initialTimezones[tz].name.replace(/_/g, ' ');
      initialTimezones[tz].label = `(UTC${
        initialTimezones[tz].utcOffset > 0
          ? '+' + initialTimezones[tz].utcOffset / 60
          : initialTimezones[tz].utcOffset === 0
          ? ''
          : initialTimezones[tz].utcOffset / 60
      }) ${name}`;
    }

    return initialTimezones;
  }, []);

  const [timezonesFound, setTimezonesFound] = useState(timezones);
  const [timezone, setTimezone] = useState(initialValues.timezone || '');

  const syncCalendar = async () => {
    setLoading(true);
    actions
      .syncCalendarEvents('google')
      .then((data) => {
        if (data.synced) {
          Alert.alert('Calendar has been synced before');
        } else {
          // Open 3rd party url inside the app webview
          navigation.navigate('internalBrowser', {
            uri: data.url,
            successUrl: GOOGLE_AUTH_SETUP_REDIRECT_URL_SUCCESS,
            successModalMsg:
              'Your calendar is now linked! New Texty appointments will be added automatically.',
            failureUrl: GOOGLE_AUTH_SETUP_REDIRECT_URL_FAILURE,
            failureModalMsg:
              'Your calendar is now linked! New Texty appointments will be added automatically.',
          });
        }
      })
      .catch((error) => {
        Alert.alert("Couldn't sync calendar");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const searchResults = [];
    const toSearch = timezone.toLowerCase();
    for (const tz in timezones) {
      if (timezones[tz].label.toLowerCase().includes(toSearch)) {
        searchResults.push(timezones[tz]);
      }
    }

    setTimezonesFound(searchResults);
  }, [timezone]);

  return (
    <Formik
      initialValues={{timezone}}
      onSubmit={(data) => {
        setLoading(true);
        onFormSubmit(data).then(() => {
          setLoading(false);
        });
        setValidatingRealTime(true);
      }}
      validationSchema={CallSchema}
      validateOnBlur={false}
      validateOnChange={validatingRealTime}>
      {(props) => (
        <View style={styles.background}>
          <AlertBox
            visible={successModal}
            onDismiss={() => setSuccessModal(false)}
            onSubmit={() => {
              setSuccessModal(false);
            }}
            type="success"
            title="Sync Calendar"
            text="Calendar synced successfully"
          />
          <Header
            title="Call Settings"
            handleBack={onDismiss}
            handleDone={() => {
              props.handleSubmit();
            }}
            loading={loading}
          />
          <View style={styles.container}>
            <TouchableOpacity onPress={syncCalendar}>
              <Text style={[Typography.subtitle, tw('text-blue')]}>
                Sync Calendar
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.container}>
            <Input
              icon="search"
              label="Timezone"
              value={timezone}
              onChangeText={(value) => {
                setShowResults(true);
                props.setFieldValue('timezone', value);
                setTimezone(value);
              }}
              error={errors?.timezone_name || props.errors.timezone}
              defaultValue={timezone}
              searchResults={timezonesFound}
              isSearch={showResults}
              onSearchResultPress={({label, name}) => {
                props.setFieldValue('timezone', name);
                setTimezone(label);
                Keyboard.dismiss();
                setTimezonesFound([]);
                setShowResults(false);
              }}
              renderRight={
                showResults ? (
                  <TouchableOpacity
                    onPress={() => setShowResults(!showResults)}>
                    <Icon
                      color={COLORS.gray}
                      type="font-awesome-5"
                      name="chevron-up"
                      size={wp(4.5)}
                    />
                  </TouchableOpacity>
                ) : null
              }
            />
          </View>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: COLORS.white,
  },
  container: {
    ...Containers.container,
    ...tw('py-4'),
  },
});

export default CallSchedulingForm;
