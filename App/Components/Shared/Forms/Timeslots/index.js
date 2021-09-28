/* eslint-disable max-lines */
import React, {useCallback, useContext, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Keyboard,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Formik} from 'formik';
import {Inputs, Buttons, Containers, Typography} from '../../../../Styles';
import * as Yup from 'yup';
import hours from './hours';
import {Day} from '@/Components/Shared/Data/Day';
import {Header} from '@/Components/Layout/Header';
import {COLORS} from 'Styles/colors.js';
import {ItemStore} from 'State/ItemContext';
import {Picker} from '@/Components/Inputs/Picker';
import tw from 'tw';
import {Card} from 'Components/Cards/Card';
import {Icon} from 'react-native-elements';
import {formatPrice} from 'utils/number';

const TimeslotSchema = Yup.object().shape({
  days: Yup.array().required('You must select days'),
  start: Yup.number().required('Cannot be blank').typeError('Cannot be blank'),
  end: Yup.number().required('Cannot be blank').typeError('Cannot be blank'),
});

const convertTo24h = (time) => {
  if (time && time.length) {
    if (time[1] === 'pm') {
      if (time[0] === 12) {
        return time[0];
      }
      return time[0] + 12;
    }

    if (time[0] === 12) {
      return 0;
    }

    return time[0];
  }
  return '';
};

export const TimeslotsForm = ({
  initialValues,
  onFormSubmit,
  loading,
  onDismiss,
}) => {
  const [validatingRealTime, setValidatingRealTime] = useState(false);

  const [start, setStart] = useState(convertTo24h(initialValues.startTime));
  const [end, setEnd] = useState(convertTo24h(initialValues.endTime));

  const [days, setDays] = useState(initialValues.days || []);
  const [scheduleId] = useState(initialValues.id || '');
  const [items, setItems] = useState(initialValues.items || []);
  const [is_default, setDefault] = useState(initialValues.is_default || false);
  const [noItemsError, setNoItemsError] = useState(false);
  const {itemState} = useContext(ItemStore);

  const selectDay = (id, formik) => {
    const index = days.indexOf(id);
    if (index > -1) {
      formik.setFieldValue(
        'days',
        days.filter((item) => item !== id),
      );
      setDays(days.filter((item) => item !== id));
    } else {
      formik.setFieldValue('days', [...days, id]);
      setDays([...days, id]);
    }
  };

  const toggleItem = useCallback(
    (id) => {
      setNoItemsError(false);
      setItems((curr) =>
        curr.includes(id) ? curr.filter((i) => i !== id) : [...curr, id],
      );
    },
    [setItems],
  );

  const toggleDefault = useCallback(() => {
    setNoItemsError(false);
    if (is_default) {
      setItems([]);
      setDefault(false);
    } else {
      setItems(itemState.unslottedItems.map((i) => i.id));
      setDefault(true);
    }
  }, [is_default, setDefault, setItems]);

  return (
    <Formik
      initialValues={{
        start,
        end,
        days,
        id: scheduleId,
      }}
      onSubmit={(data) => {
        onFormSubmit({...data, items, is_default});
        setValidatingRealTime(true);
      }}
      validationSchema={TimeslotSchema}
      validateOnBlur={false}
      validateOnChange={validatingRealTime}>
      {(props) => (
        <ScrollView
          contentContainerStyle={tw('h-full')}
          style={styles.pageContainer}>
          <Header
            title={initialValues.id ? 'Edit Timeslot' : 'Add Timeslot'}
            backTitle="Close"
            handleBack={onDismiss}
            loading={loading}
            handleDone={async () => {
              if (is_default || items.length) {
                Keyboard.dismiss();
                const res = await props.validateForm();

                if (Object.keys(res).length === 0) {
                  props.handleSubmit();
                }
              } else {
                setNoItemsError(true);
              }
            }}
          />

          <View style={styles.container}>
            <View>
              <Text style={styles.inputLabel}>Days</Text>
            </View>
            <View
              style={{
                ...(Platform.OS !== 'android' && {
                  zIndex: 10,
                }),
              }}>
              <View style={styles.daysContainer}>
                {[
                  {name: 'SU', id: 7},
                  {name: 'MO', id: 1},
                  {name: 'TU', id: 2},
                  {name: 'WE', id: 3},
                  {name: 'TH', id: 4},
                  {name: 'FR', id: 5},
                  {name: 'SA', id: 6},
                ].map((day) => (
                  <TouchableOpacity
                    key={day.id}
                    onPress={() => selectDay(day.id, props)}
                    style={Buttons.transparentButton}>
                    <Day
                      active={days.length && days.includes(day.id)}
                      text={day.name}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              {props.errors.days && (
                <Text style={styles.validationError}>{props.errors.days}</Text>
              )}
              <Text style={styles.inputLabel}>Time</Text>
              <View style={styles.dropdownWrapper}>
                <View style={[styles.inputWrapper]}>
                  <Picker
                    hideLabel
                    defaultValue={start}
                    values={hours}
                    onChangeItem={(value) => {
                      props.setFieldValue('start', value);
                      setStart(value);
                    }}
                    placeholder="Start"
                    error={props.errors.start}
                  />
                </View>
                <Text>–</Text>
                <View style={styles.inputWrapper}>
                  <Picker
                    hideLabel
                    defaultValue={end}
                    values={hours.filter((item) => item.value > start)}
                    onChangeItem={(value) => {
                      props.setFieldValue('end', value);
                      setEnd(value);
                    }}
                    placeholder="End"
                    error={props.errors.end}
                  />
                </View>
              </View>
              <View
                style={tw(
                  'flex flex-row items-center justify-between flex-wrap',
                )}>
                <Text style={[styles.inputLabel, tw('mb-0 mt-4')]}>Items</Text>
                <TouchableOpacity
                  style={tw('flex flex-row items-center')}
                  onPress={toggleDefault}>
                  <Text style={tw('text-blue mr-1.5')}> all</Text>
                  <Icon
                    color={COLORS.blue}
                    size={24}
                    type="ionicon"
                    name={is_default ? 'checkbox-outline' : 'square-outline'}
                    style={styles.planIcon}
                  />
                </TouchableOpacity>
                <View style={tw('w-full')}>
                  {noItemsError && (
                    <Text style={[styles.validationError, tw('mt-0')]}>
                      Please select an item
                    </Text>
                  )}
                </View>
              </View>

              <View style={tw('mt-2')}>
                {itemState.unslottedItems.map((item, idx) => (
                  <View key={idx}>
                    <Card
                      onPress={() => toggleItem(item.id)}
                      title={item.name}
                      renderIcon={
                        <Icon
                          color={COLORS.blue}
                          size={24}
                          type="ionicon"
                          name={
                            items.includes(item.id)
                              ? 'checkbox-outline'
                              : 'square-outline'
                          }
                          style={styles.planIcon}
                        />
                      }
                      description={formatPrice(`${item.price}`)}
                    />
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    backgroundColor: COLORS.lightGray,
  },
  container: {
    ...Containers.container,
  },
  daysContainer: {
    ...tw('flex-row'),
    justifyContent: 'space-between',
    width: '100%',
  },
  validationError: {
    ...Inputs.validationError,
    marginLeft: 0,
  },
  buttonContainer: {
    ...Containers.itemContainer,
  },
  dropdownContainerStyle: {
    ...Inputs.dropdownContainerStyle,
    marginTop: 0,
  },
  dropdownActiveLabel: {
    ...Inputs.dropdownActiveLabel,
  },
  dropdownLabel: {
    ...Inputs.dropdownLabel,
  },
  dropdownItems: {
    ...Inputs.dropdownItems,
  },
  inputWrapper: {
    width: '40%',
  },
  inputLabel: {
    ...Typography.title,
    ...tw('mb-4 mt-3'),
  },
  inputBox: {
    ...Inputs.noIconInput,
  },
  nextButton: {
    ...Buttons.primaryButton,
    ...Buttons.formButton,
  },
  nextButtonText: {
    ...Buttons.lightButtonText,
  },
  dropdownWrapper: tw('flex-row justify-between items-center'),
});
