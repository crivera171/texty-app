/* eslint-disable max-lines */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Keyboard,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {Formik} from 'formik';
import {Inputs, Containers, Typography, Buttons} from '@/Styles';
import * as Yup from 'yup';
import {numberFilter} from '@/utils/number';
import {Input} from '@/Components/Inputs/Input';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {ButtonGroup} from '@/Components/Buttons/ButtonGroup';
import tw from 'tw';
import {COLORS} from '@/Styles/colors';

const ItemsSchema = Yup.object().shape({
  price: Yup.number()
    .required('Please enter item price')
    .typeError('Please enter dollar amounts as a decimal (e.g. 14.99)')
    .test(
      'price',
      'Price must start at $0.50',
      (val) => val === 0 || val >= 50,
    ),
  call_duration: Yup.number()
    .min(15, '15 minutes minimum')
    .max(60, '60 minutes maximum')
    .required('Enter call duration')
    .typeError('Please call duration in minutes (e.g. 15)'),
  response_discount: Yup.number().when('type', {
    is: 'subscription',
    then: Yup.number()
      .min(0, 'Min 0%')
      .max(100, 'Max 100%')
      .required('Enter response discount')
      .typeError('Enter item discount'),
  }),
  call_discount: Yup.number().when('type', {
    is: 'subscription',
    then: Yup.number()
      .min(0, 'Min 0%')
      .max(100, 'Max 100%')
      .required('Enter meeting discount')
      .typeError('Enter item discount'),
  }),
  content_discount: Yup.number().when('type', {
    is: 'subscription',
    then: Yup.number()
      .min(0, 'Min 0%')
      .max(100, 'Max 100%')
      .required('Enter discount for content')
      .typeError('Enter item discount'),
  }),
});

export const ItemPrice = ({initialValues, onSubmit, onBack, loading}) => {
  const [validatingRealTime, setValidatingRealTime] = useState(false);

  const [price, setPrice] = useState(initialValues.price);

  const [callDuration, setCallDuration] = useState(
    (initialValues?.call_duration && initialValues.call_duration.toFixed(2)) ||
      '15 min',
  );

  const [publishable, setPublishable] = useState(false);

  const [responseDiscount, setResponseDiscount] = useState(
    (initialValues?.discounts &&
      initialValues.discounts
        .filter((e) => e?.product_type === 'response')
        .reduce((a, b) => b?.value, 0)) ||
      '50',
  );

  const [callDiscount, setCallDiscount] = useState(
    (initialValues?.discounts &&
      initialValues.discounts
        .filter((e) => e?.product_type === 'call')
        .reduce((a, b) => b?.value, 0)) ||
      '50',
  );

  const [contentDiscount, setContentDiscount] = useState(
    (initialValues?.discounts &&
      initialValues.discounts
        .filter((e) => e?.product_type === 'content')
        .reduce((a, b) => b?.value, 0)) ||
      '50',
  );

  const saveItem = (data) => {
    Keyboard.dismiss();

    const discounts =
      initialValues.type === 'subscription'
        ? [
            {product_type: 'response', value: data.response_discount},
            {product_type: 'call', value: data.call_discount},
            {product_type: 'content', value: data.content_discount},
          ]
        : [];

    onSubmit({
      ...data,
      discounts,
    });
  };

  useEffect(() => {
    if (
      initialValues.name &&
      initialValues.description &&
      initialValues.type &&
      initialValues.hashtag
    ) {
      setPublishable(true);
    }
  }, [initialValues]);

  return (
    <Formik
      initialValues={{
        price,
        call_duration: numberFilter(callDuration),
        type: initialValues.type,
        response_discount: numberFilter(responseDiscount),
        call_discount: numberFilter(callDiscount),
        content_discount: numberFilter(contentDiscount),
      }}
      onSubmit={saveItem}
      validationSchema={ItemsSchema}
      validateOnBlur={false}
      validateOnChange={validatingRealTime}>
      {(props) => (
        <View style={styles.pageContainer}>
          <View style={styles.formContainer}>
            <KeyboardAvoidingView behavior={'padding'}>
              <ScrollView contentContainerStyle={[tw('pt-4')]}>
                {initialValues.type === 'call' && (
                  <View style={[Containers.container, tw('pb-4')]}>
                    <View style={styles.itemInputContainer}>
                      <Text style={styles.screenTitle}>
                        How many minutes should the meeting last?
                      </Text>

                      <Input
                        value={callDuration}
                        keyboardType="number-pad"
                        placeholder="15 min"
                        onChangeText={(text) => {
                          const filteredText = numberFilter(text);
                          props.handleChange('call_duration')(filteredText);
                          setCallDuration(text);
                        }}
                        error={props.errors.call_duration}
                        mask="[99] min"
                      />
                    </View>
                  </View>
                )}

                <View style={[Containers.container, tw('py-4')]}>
                  {initialValues.type === 'subscription' ? (
                    <Text style={[styles.inputNote, tw('mb-2')]}>
                      Let fans join your monthly membership group. Set the
                      monthly subscription fee below, and offer them discounts
                      on items purchased through you Texty profile.
                    </Text>
                  ) : null}

                  <Input
                    label={
                      initialValues.type === 'subscription'
                        ? 'Monthly Subscription Price'
                        : 'What price will you charge?'
                    }
                    value={price}
                    onChangeText={(val) => {
                      props.handleChange('price')(val);
                      setPrice(val);
                    }}
                    type="price"
                  />
                </View>

                {initialValues.type === 'subscription' ? (
                  <View style={[Containers.container, tw('py-4')]}>
                    <Text style={styles.screenTitle}>
                      Set a discount for each item type:{' '}
                      <Text style={tw('font-normal italic')}>(optional)</Text>
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
                          placeholder="50"
                          onChangeText={(text) => {
                            setResponseDiscount(text);
                            const newDiscount = numberFilter(text);
                            props.handleChange('response_discount')(
                              newDiscount,
                            );
                          }}
                          mask="[999]"
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
                          placeholder="50"
                          onChangeText={(text) => {
                            const newDiscount = numberFilter(text);
                            props.setFieldValue('call_discount', newDiscount);
                            setCallDiscount(text);
                          }}
                          mask="[999]"
                        />
                      </View>
                    </View>
                    <View style={styles.lineInputContainer}>
                      <View style={styles.lineInputChild}>
                        <Text style={styles.lineInputChildLabel}>
                          Content (%)
                        </Text>
                        {props.errors.content_discount && (
                          <Text style={styles.validationError}>
                            {props.errors.content_discount}
                          </Text>
                        )}
                      </View>
                      <View style={styles.lineInput}>
                        <Input
                          value={contentDiscount}
                          keyboardType="number-pad"
                          placeholder="50"
                          onChangeText={(text) => {
                            const newDiscount = numberFilter(text);
                            props.setFieldValue(
                              'content_discount',
                              newDiscount,
                            );
                            setContentDiscount(text);
                          }}
                          mask="[999]"
                        />
                      </View>
                    </View>
                  </View>
                ) : null}
              </ScrollView>
            </KeyboardAvoidingView>
          </View>

          <ButtonGroup
            onBack={onBack}
            disableNextBtn={!publishable}
            nextTitle="Publish"
            loading={loading}
            onNext={() => {
              Keyboard.dismiss();
              props.handleSubmit();
              setValidatingRealTime(true);
            }}
          />
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    height: '100%',
  },
  screenTitle: {
    ...Typography.subtitle,
  },
  formContainer: {
    ...Containers.tabPageContainer,
    ...tw('w-full flex justify-between h-full flex-1 pt-0'),
  },
  controls: {
    ...Containers.flexCenter,
    paddingBottom: hp(5),
  },
  nextButton: {
    ...Buttons.formButton,
  },
  disabledButton: {
    opacity: 0.3,
  },
  nextButtonText: {
    ...Buttons.lightButtonText,
  },
  priceInput: {
    ...Inputs.mainInput,
    width: '100%',
    textAlign: 'center',
  },
  priceInputLabel: {
    ...Inputs.mainInputLabel,
  },
  checkboxLabel: {
    ...Inputs.checkboxLabel,
  },
  checkboxContainer: {
    ...Inputs.checkboxContainer,
  },
  checkbox: {
    ...Inputs.checkbox,
  },
  inputNote: {
    ...Typography.notice,
  },
  lineInputContainer: {
    ...Inputs.itemInputContainer,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  lineInput: {
    maxWidth: 100,
    textAlign: 'center',
    borderColor: COLORS.darkGray,
  },
  lineInputChild: {
    paddingLeft: 30,
  },
  lineInputChildLabel: {
    ...Inputs.itemInputLabel,
    ...tw('mr-2'),
  },
  validationError: {
    ...Inputs.validationError,
    marginLeft: 0,
    marginTop: 4,
  },
});
