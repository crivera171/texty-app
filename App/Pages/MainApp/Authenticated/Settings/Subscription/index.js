/* eslint-disable max-lines */
import React, {useEffect, useState, useCallback, useContext} from 'react';
import {
  Platform,
  Keyboard,
  View,
  StyleSheet,
  Text,
  Switch,
  ScrollView,
} from 'react-native';
import {Formik} from 'formik';
import {Inputs} from '@/Styles';
import {COLORS} from '@/Styles/colors';
import * as Yup from 'yup';
import {Header} from '@/Components/Layout/Header';
import {ProfileStore} from 'State/ProfileContext';
import {ItemStore} from 'State/ItemContext';
import {numberFilter} from '@/utils/number';
import {PriceInput} from 'Components/Inputs/PriceInput';
import {Input} from '@/Components/Inputs/Input';

const SubscriptionSchema = Yup.object().shape({
  price: Yup.number()
    .typeError('Please enter dollar amounts as a decimal (e.g. 14.99)')
    .when('type', (type, schema) => {
      return type === 'free-text'
        ? schema
        : schema
            .min(5, 'Price must start at $5')
            .required('Enter price for your item');
    }),
  discount_enabled: Yup.boolean(),
  response_discount: Yup.number().when('discount_enabled', {
    is: true,
    then: Yup.number()
      .min(0, 'Min 0%')
      .max(100, 'Max 100%')
      .required('Enter response discount')
      .typeError('Enter item discount'),
  }),
  call_discount: Yup.number().when('discount_enabled', {
    is: true,
    then: Yup.number()
      .min(0, 'Min 0%')
      .max(100, 'Max 100%')
      .required('Enter meeting discount')
      .typeError('Enter item discount'),
  }),
  /*
  has_trial: Yup.boolean(),
  trial_days: Yup.number().when('has_trial', {
    is: true,
    then: Yup.number()
      .min(1, '1 Day Minimum')
      .required('Enter trial duration')
      .typeError('Please enter number of days'),
  }),
  trial_option_one: Yup.number().when('has_trial', {
    is: true,
    then: Yup.number()
      .required('Enter trial price')
      .typeError('Enter dollar amount'),
  }),
  trial_option_two: Yup.number().when('has_trial', {
    is: true,
    then: Yup.number()
      .required('Enter trial price')
      .typeError('Enter dollar amount'),
  }),
  trial_option_three: Yup.number().when('has_trial', {
    is: true,
    then: Yup.number()
      .required('Enter trial price')
      .typeError('Enter dollar amount'),
  }),
  trial_option_four: Yup.number().when('has_trial', {
    is: true,
    then: Yup.number()
      .required('Enter trial price')
      .typeError('Enter dollar amount'),
  }),
  */
});

const SubscriptionForm = ({onFormSubmit, initialValues, onDismiss}) => {
  const [price, setPrice] = useState(initialValues.price || 0);
  const [isEnabled, setIsEnabled] = useState(initialValues.is_enabled || false);
  const [hasDiscount, setHasDiscount] = useState(
    !!(initialValues.discounts && initialValues.discounts.length) || false,
  );
  const [name] = useState(initialValues.name || 'Subscription');
  const [description] = useState(initialValues.description || '');
  const [responseDiscount, setResponseDiscount] = useState('50');
  const [callDiscount, setCallDiscount] = useState('50');

  const [hasTrial] = useState(initialValues.has_trial || false);
  const [trialDays] = useState(initialValues.trial_days || 2);
  const [trialOption1, setTrialOption1] = useState(0);
  const [trialOption2, setTrialOption2] = useState(299);
  const [trialOption3, setTrialOption3] = useState(799);
  const [trialOption4, setTrialOption4] = useState(1499);

  const [itemId] = useState(initialValues.id || false);

  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (initialValues) {
      if (initialValues.discounts && initialValues.discounts.length) {
        initialValues.discounts.map((item) => {
          if (item.product_type === 'response') {
            setResponseDiscount(item.value);
          } else {
            setCallDiscount(item.value);
          }
        });
      }
      if (initialValues.trial_prices && initialValues.trial_prices.length) {
        setTrialOption1(initialValues.trial_prices[0].price);
        setTrialOption2(initialValues.trial_prices[1].price);
        setTrialOption3(initialValues.trial_prices[2].price);
        setTrialOption4(initialValues.trial_prices[3].price);
      }
    }
  }, [initialValues]);

  const saveItem = (data) => {
    setIsUpdating(true);
    Keyboard.dismiss();

    data.price = parseInt(data.price);

    const discounts = data.discount_enabled
      ? [
          {product_type: 'response', value: data.response_discount},
          {product_type: 'call', value: data.call_discount},
        ]
      : [];

    const trial_prices = [
      parseInt(data.trial_option_one),
      parseInt(data.trial_option_two),
      parseInt(data.trial_option_three),
      parseInt(data.trial_option_four),
    ];

    onFormSubmit({
      ...data,
      type: 'subscription',
      editing_id: itemId,
      discounts,
      trial_prices,
    });
  };

  return (
    <Formik
      onSubmit={saveItem}
      initialValues={{
        name,
        description,
        price,
        is_enabled: isEnabled,
        has_trial: hasTrial,
        trial_days: trialDays,
        discount_enabled: hasDiscount,
        response_discount: responseDiscount,
        call_discount: callDiscount,
        trial_option_one: trialOption1,
        trial_option_two: trialOption2,
        trial_option_three: trialOption3,
        trial_option_four: trialOption4,
      }}
      validationSchema={SubscriptionSchema}
      validateOnBlur={false}
      validateOnChange={false}>
      {(props) => (
        <>
          <Header
            title="Subscription"
            handleBack={onDismiss}
            handleDone={() => {
              props.handleSubmit();
            }}
            loading={isUpdating}
          />
          <View
            style={{
              backgroundColor: COLORS.white,
              ...(Platform.OS !== 'android' && {
                zIndex: 10,
              }),
            }}>
            <View style={styles.container}>
              <View style={styles.switchContainer}>
                <Text style={styles.inputLabel}>Enable Subscription</Text>
                <Switch
                  onValueChange={(isEnabledValue) => {
                    props.setFieldValue('is_enabled', isEnabledValue);
                    setIsEnabled(isEnabledValue);
                  }}
                  name="is_enabled"
                  value={isEnabled}
                />
              </View>
            </View>
            {isEnabled ? (
              <View>
                <View style={styles.container}>
                  <View stackedLabel style={styles.itemInputContainer}>
                    <Text style={styles.inputLabel}>Monthly Price</Text>

                    <PriceInput
                      value={price}
                      onChange={(val) => {
                        props.handleChange('price')(val);
                        setPrice(val);
                      }}
                      error={props.errors.price}
                    />
                  </View>
                  {props.errors.price && (
                    <Text style={styles.validationError}>
                      {props.errors.price}
                    </Text>
                  )}
                </View>

                <View style={styles.container}>
                  <View style={styles.switchContainer}>
                    <Text style={styles.inputLabel}>
                      Subscribers receive discounts on items
                    </Text>
                    <Switch
                      onValueChange={(hasDiscountValue) => {
                        props.setFieldValue(
                          'discount_enabled',
                          hasDiscountValue,
                        );
                        setHasDiscount(hasDiscountValue);
                      }}
                      name="discount_enabled"
                      value={hasDiscount}
                    />
                  </View>
                </View>

                {hasDiscount ? (
                  <View style={styles.fieldsContainer}>
                    <View style={styles.container}>
                      <Text style={styles.inputNote}>
                        Set a discount for each item type.
                      </Text>

                      <View style={styles.lineInputContainer}>
                        <View style={styles.lineInputChild}>
                          <Text style={styles.lineInputChildLabel}>
                            Response (%)
                          </Text>
                          {props.errors.response_discount && (
                            <Text style={styles.validationError}>
                              {props.errors.response_discount}
                            </Text>
                          )}
                        </View>
                        <View style={styles.lineInput}>
                          <Input
                            value={responseDiscount}
                            keyboardType="number-pad"
                            placeholder="50%"
                            onChangeText={(text) => {
                              setResponseDiscount(text);
                              const newDiscount = numberFilter(text);
                              props.handleChange('response_discount')(
                                newDiscount,
                              );
                            }}
                            error={props.errors.response_discount}
                            mask="[99]%"
                          />
                        </View>
                      </View>

                      <View style={styles.lineInputContainer}>
                        <View style={styles.lineInputChild}>
                          <Text style={styles.lineInputChildLabel}>
                            Meetings (%)
                          </Text>
                          {props.errors.call_discount && (
                            <Text style={styles.validationError}>
                              {props.errors.call_discount}
                            </Text>
                          )}
                        </View>
                        <View style={styles.lineInput}>
                          <Input
                            value={callDiscount}
                            keyboardType="number-pad"
                            placeholder="50%"
                            onChangeText={(text) => {
                              const newDiscount = numberFilter(text);
                              props.setFieldValue('call_discount', newDiscount);
                              setCallDiscount(text);
                            }}
                            error={props.errors.call_discount}
                            mask="[99]%"
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                ) : null}
              </View>
            ) : null}

            {/*
                <View style={styles.container}>
                  <View style={styles.switchContainer}>
                    <Text style={styles.inputLabel}>Trial Enabled</Text>
                    <Switch
                      onValueChange={(hasTrialValue) => {
                        props.setFieldValue('has_trial', hasTrialValue);
                        setHasTrial(hasTrialValue);
                      }}
                      name="has_trial"
                      value={hasTrial}
                    />
                  </View>
                </View>

                {hasTrial && (
                  <View style={styles.fieldsContainer}>
                    <View style={styles.container}>
                      <Text style={styles.inputNote}>
                        Fans can select any one of these prices to start a trial
                        subscription. Your fans will be charged the full
                        subscription price when the trial expires.
                      </Text>
                      <View style={styles.lineInputContainer}>
                        <View style={styles.lineInputChild}>
                          <Text style={styles.lineInputChildLabel}>
                            Trial Option Amount #1
                          </Text>
                          {props.errors.trial_option_one && (
                            <Text style={styles.validationError}>
                              {props.errors.trial_option_one}
                            </Text>
                          )}
                        </View>
                        <PriceInput
                          value={trialOption1}
                          onChange={(val) => {
                            props.handleChange('trial_option_one')(val);
                            setTrialOption1(val);
                          }}
                          error={props.errors.trial_option_one}
                          width={140}
                        />
                      </View>

                      <View style={styles.lineInputContainer}>
                        <View style={styles.lineInputChild}>
                          <Text style={styles.lineInputChildLabel}>
                            Trial Option Amount #2
                          </Text>
                          {props.errors.trial_option_two && (
                            <Text style={styles.validationError}>
                              {props.errors.trial_option_two}
                            </Text>
                          )}
                        </View>
                        <PriceInput
                          value={trialOption2}
                          onChange={(val) => {
                            props.handleChange('trial_option_two')(val);
                            setTrialOption2(val);
                          }}
                          error={props.errors.trial_option_two}
                          width={140}
                        />
                      </View>

                      <View style={styles.lineInputContainer}>
                        <View style={styles.lineInputChild}>
                          <Text style={styles.lineInputChildLabel}>
                            Trial Option Amount #3
                          </Text>
                          {props.errors.trial_option_three && (
                            <Text style={styles.validationError}>
                              {props.errors.trial_option_three}
                            </Text>
                          )}
                        </View>
                        <PriceInput
                          value={trialOption3}
                          onChange={(val) => {
                            props.handleChange('trial_option_three')(val);
                            setTrialOption3(val);
                          }}
                          error={props.errors.trial_option_three}
                          width={140}
                        />
                      </View>

                      <View style={styles.lineInputContainer}>
                        <View style={styles.lineInputChild}>
                          <Text style={styles.lineInputChildLabel}>
                            Trial Option Amount #4
                          </Text>
                          {props.errors.trial_option_one && (
                            <Text style={styles.validationError}>
                              {props.errors.trial_option_four}
                            </Text>
                          )}
                        </View>
                        <PriceInput
                          value={trialOption4}
                          onChange={(val) => {
                            props.handleChange('trial_option_four')(val);
                            setTrialOption4(val);
                          }}
                          error={props.errors.trial_option_four}
                          width={140}
                        />
                      </View>
                      <View style={styles.lineInputContainer}>
                        <View>
                          <Text style={styles.itemInputLabel}>
                            Trial Duration (Days)
                          </Text>
                          {props.errors.trial_days && (
                            <Text style={styles.validationError}>
                              {props.errors.trial_days}
                            </Text>
                          )}
                        </View>

                        <TextInputMask
                          style={[
                            styles.lineInput,
                            props.errors.trial_days && Inputs.inputError,
                          ]}
                          type="only-numbers"
                          value={trialDays}
                          onChangeText={(text) => {
                            const newDuration = numberFilter(text);
                            props.setFieldValue('trial_days', newDuration);
                            setTrialDays(text);
                          }}
                          name="trial_days"
                          placeholder="5"
                        />
                      </View>
                    </View>
                  </View>
                        )} */}
          </View>
        </>
      )}
    </Formik>
  );
};

const SubscriptionPage = ({route, navigation}) => {
  const {subscription} = route.params;

  const {actions} = useContext(ProfileStore);
  const {itemActions} = useContext(ItemStore);

  const onFormSubmit = useCallback(
    ({
      name,
      description,
      type,
      is_enabled,
      price,
      editing_id,
      discounts,
      has_trial,
      trial_days,
      trial_prices,
    }) => {
      itemActions
        .saveInfluencerItem({
          name,
          description,
          type,
          is_enabled,
          price,
          editing_id,
          discounts,
          has_trial,
          trial_days,
          trial_prices,
        })
        .then(() => {
          actions.fetchProfile().then(() => navigation.goBack());
        })
        .catch((err) => {
          console.log('Error', err);
        });
    },
    [itemActions.saveInfluencerItem],
  );

  return (
    <View>
      <ScrollView>
        <SubscriptionForm
          onDismiss={() => navigation.goBack()}
          onFormSubmit={onFormSubmit}
          initialValues={subscription}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
  },
  inputLabel: {
    ...Inputs.itemInputLabel,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  validationError: {
    ...Inputs.validationError,
    marginLeft: 0,
    marginTop: 4,
  },
  inputNote: {
    color: COLORS.black,
    paddingVertical: 10,
    width: '100%',
    textAlign: 'left',
  },
  itemInputContainer: {
    ...Inputs.itemInputContainer,
    marginTop: 10,
  },
  itemInputLabel: {
    ...Inputs.itemInputLabel,
  },
  lineInputChildLabel: {
    ...Inputs.itemInputLabel,
    color: COLORS.blue,
  },
  themedInput: {
    ...Inputs.itemInput,
  },
  switchContainer: {
    ...Inputs.switchContainer,
  },
  lineInputContainer: {
    ...Inputs.itemInputContainer,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  lineInput: {
    minWidth: 100,
    textAlign: 'center',
    borderColor: COLORS.darkGray,
  },
  fieldsContainer: {
    backgroundColor: COLORS.lightGray,
    paddingTop: 10,
    paddingBottom: 20,
    width: '100%',
  },
  lineInputChild: {
    paddingLeft: 30,
  },
  priceInput: {
    ...Inputs.mainInput,
    minWidth: 100,
    textAlign: 'center',
    height: 55,
  },
  priceFree: {
    ...Inputs.mainInput,
    maxWidth: 100,
    alignSelf: 'flex-start',
    height: 55,
  },
  priceInputLabel: {
    ...Inputs.mainInputLabel,
  },
});

export default SubscriptionPage;
