/* eslint-disable max-lines */
import React, {useContext, useCallback, useState} from 'react';
import {View, StyleSheet, Switch, Text, RefreshControl} from 'react-native';
import tw from 'tw';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {Icon, Button} from 'react-native-elements';
import {ProfileStore} from 'State/ProfileContext';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {Input} from '@/Components/Inputs/Input';
import {numberFilter} from '@/utils/number';
import {useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Typography, Containers} from '@/Styles';
import {COLORS} from 'Styles/colors.js';
import {useFocusEffect} from '@react-navigation/native';

const AutorenewSchema = Yup.object().shape({
  autofill_credits: Yup.boolean(),
  autofill_credit_amount: Yup.number().when('autofill_credits', {
    is: true,
    then: Yup.number()
      .required('Enter autofill credit amount')
      .min(100, '100 credits minimum')
      .typeError('Must be a number'),
  }),
});

export const CreditsComponent = () => {
  const {state, actions} = useContext(ProfileStore);
  const navigation = useNavigation();

  const influencer = state.profile;

  const [isAutofillEnabled, setIsAutofillEnabled] = useState(
    influencer.autofill_credits || false,
  );

  const [autofillAmount, setAutofillAmount] = useState(
    influencer.autofill_credit_amount || 100,
  );

  const onSubmit = useCallback(
    ({autofill_credits, autofill_credit_amount}) => {
      actions.editProfile({autofill_credits, autofill_credit_amount});
    },
    [actions.editProfile],
  );

  // This effect is used for callback to be ran everytime screen comes into the focus
  // When tabs in dashboard are switching this code portion is not executed
  // Used when returning from webview, to properly display latest credits amount
  useFocusEffect(
    React.useCallback(() => {
      // TODO: figure out why this crashes an app if uncommented
      // actions.fetchProfile();
    }, []),
  );

  return (
    <KeyboardAwareScrollView
      refreshControl={
        <RefreshControl
          refreshing={state.loading}
          onRefresh={() => actions.fetchProfile()}
        />
      }>
      <View style={styles.container}>
        <Text style={styles.title}>{influencer.credits}</Text>
        <Text style={[styles.subtitle, tw('-mt-3')]}>Your Credits</Text>
      </View>

      <Formik
        initialValues={{
          autofill_credits: isAutofillEnabled,
          autofill_credit_amount: autofillAmount,
        }}
        onSubmit={onSubmit}
        validationSchema={AutorenewSchema}
        validateOnBlur={false}>
        {(props) => (
          <>
            <View style={styles.container}>
              <View style={tw('flex-row justify-center')}>
                <View style={tw('flex-1')}>
                  <Text style={styles.inputLabel}>Auto Refresh</Text>
                </View>
                <Switch
                  onValueChange={(value) => {
                    props.setFieldValue('autofill_credits', value);
                    setIsAutofillEnabled(value);
                  }}
                  name="autofill_credits"
                  value={isAutofillEnabled}
                />
              </View>
              <View>
                <View style={tw('w-full')}>
                  <Text style={styles.inputDesc}>
                    Do you want to auto refresh when balance drops below zero,
                    with {`$${(autofillAmount / 100).toFixed(2)}`} dollars?
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.container}>
              <View style={tw('flex-row justify-center items-center')}>
                <View style={tw('flex-1')}>
                  <Text style={styles.inputLabel}>Autofill Amount</Text>
                </View>
                <View style={tw('flex-1')}>
                  <Input
                    keyboardType="number-pad"
                    placeholder="100"
                    value={String(autofillAmount)}
                    onChangeText={(val) => {
                      props.setFieldValue(
                        'autofill_credit_amount',
                        numberFilter(val),
                      );
                      setAutofillAmount(val);
                    }}
                    style={tw('w-full')}
                    noPrefix
                  />
                </View>
              </View>
              <View>
                {props.errors.autofill_credit_amount ? (
                  <Text style={[styles.inputDesc, tw('text-red text-center')]}>
                    {props.errors.autofill_credit_amount}
                  </Text>
                ) : null}
              </View>
            </View>

            <View style={[styles.container, tw('py-2')]}>
              <Button
                title="Save"
                buttonStyle={tw('rounded-full py-5')}
                titleStyle={[styles.inputLabel, tw('text-blue font-semibold')]}
                type="clear"
                loading={state.loading}
                disabled={state.loading}
                onPress={() => {
                  props.handleSubmit();
                }}
              />
            </View>
          </>
        )}
      </Formik>
      {/*
      <View style={styles.option}>
        <View style={tw('py-5 px-5')}>
          <View style={styles.container}>
            <View style={tw('flex-1')}>
              <Text style={styles.inputLabel}>Payment Settings</Text>
              <Text style={styles.inputDesc}>
                Change your preffered payment method
              </Text>
            </View>
            <Icon
              size={wp(10)}
              color={COLORS.black}
              type="ionicon"
              name="md-chevron-forward-outline"
            />
          </View>
        </View>
      </View> */}
      <View style={styles.option}>
        <View style={tw('py-5 px-5')}>
          <Button
            icon={
              <Icon
                name="coins"
                type="font-awesome-5"
                size={wp(5)}
                color="white"
                style={tw('pr-3')}
              />
            }
            title="Manage Credits"
            buttonStyle={tw('rounded-full py-5')}
            titleStyle={[styles.inputLabel, tw('text-white font-semibold')]}
            onPress={() => navigation.navigate('purchaseCreditsPage')}
          />
          <View style={tw('flex flex-row justify-center items-center py-3')}>
            <Icon
              name="user-shield"
              type="font-awesome-5"
              size={wp(4)}
              color={COLORS.yellow}
              style={tw('pr-3')}
            />
            <Text style={[styles.inputDesc, tw('text-center mt-0')]}>
              Buyer Protection
            </Text>
          </View>
        </View>
      </View>
      {/*<View style={styles.option}>
        <View style={tw('py-5 px-5')}>
          <Text style={[styles.inputLabel, tw('mb-4')]}>History</Text>
          {state.creditHistory.map((change, idx) => (
            <View
              key={idx}
              style={[styles.option, tw('flex flex-row items-center py-4')]}>
              <View style={styles.icon}>
                <Icon
                  name={
                    historyConstants[change.transaction_type].iconName ||
                    'file-invoice-dollar'
                  }
                  type="font-awesome-5"
                  size={wp(8)}
                  color={
                    historyConstants[change.transaction_type].color ||
                    COLORS.black
                  }
                  style={tw('mr-4')}
                />
              </View>
              <View>
                <Text style={[styles.inputLabel, tw('font-medium')]}>
                  {historyConstants[change.transaction_type].name}
                </Text>
                <Text style={styles.inputDesc}>
                  {format(new Date(change.created_at), 'MM/dd/yyyy')}
                </Text>
              </View>
              <View style={tw('flex-1')}>
                <Text style={[styles.subtitle, tw('text-right')]}>
                  {change.transaction_type === 'spend_credits' ? '-' : ''}{' '}
                  {change.credits}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>*/}
    </KeyboardAwareScrollView>
  );
};

export const styles = StyleSheet.create({
  title: {
    fontSize: wp(14),
    ...tw('text-blue font-bold text-center'),
  },
  subtitle: {
    ...Typography.subtitle,
    ...tw('text-center'),
  },
  container: {
    ...Containers.container,
    ...tw('py-5'),
  },
  inputLabel: {
    fontSize: wp(4.5),
    ...tw('text-black font-bold'),
  },
  inputDesc: {
    fontSize: wp(4),
    ...tw('text-black mt-4'),
  },
  icon: {
    width: wp(18),
  },
});
