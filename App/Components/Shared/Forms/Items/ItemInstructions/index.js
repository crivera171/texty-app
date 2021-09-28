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
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {ButtonGroup} from '@/Components/Buttons/ButtonGroup';
import {Input} from '@/Components/Inputs/Input';
import tw from 'tw';

const ItemsSchema = Yup.object().shape({
  instructions: Yup.string().when(['type'], {
    is: (type) => type !== 'subscription',
    then: Yup.string()
      .max(750, '750 characters max')
      .required('This field is required'),
  }),
  // this doesn't want to work :(
  // includes: Yup.string().when(['type'], {
  //   is: (type) => type === 'subscription',
  //   then: Yup.string()
  //     .max(750, '750 characters max')
  //     .required('This field is required'),
  // }),
});

export const ItemInstructions = ({initialValues, onBack, onSubmit, last}) => {
  const [instructions, setInstructions] = useState(
    initialValues.instructions || '',
  );
  const [validatingRealTime, setValidatingRealTime] = useState(false);
  const [publishable, setPublishable] = useState(false);
  const [includes, setIncludes] = useState(
    initialValues.subscription_desc || '',
  );

  useEffect(() => {
    if (initialValues.name && initialValues.type) {
      setPublishable(true);
    }
  }, [initialValues]);

  return (
    <Formik
      initialValues={{
        instructions,
        type: initialValues.type,
        includes: initialValues.subscription_desc,
      }}
      onSubmit={onSubmit}
      validationSchema={ItemsSchema}
      validateOnBlur={false}
      validateOnChange={validatingRealTime}>
      {(props) => (
        <View style={styles.pageContainer}>
          <View style={styles.formContainer}>
            <KeyboardAvoidingView behavior={'padding'}>
              <ScrollView
                contentContainerStyle={[
                  Containers.container,
                  tw('border-b-0 pt-4'),
                ]}>
                {initialValues.type === 'subscription' ? (
                  <View>
                    <View style={styles.inputContainer}>
                      <Input
                        label="What does this subscription include?"
                        multiline={true}
                        numberOfLines={8}
                        placeholder="Type..."
                        onChangeText={(includesText) => {
                          props.handleChange('includes')(includesText);
                          setIncludes(includesText);
                        }}
                        name="includes"
                        value={includes}
                        error={props.errors.includes}
                        maxCharacters={750}
                      />
                    </View>
                  </View>
                ) : (
                  <View>
                    <View style={styles.inputContainer}>
                      <Input
                        label="What info do you need from your fans?"
                        multiline={true}
                        numberOfLines={8}
                        placeholder="Type..."
                        onChangeText={(descText) => {
                          props.handleChange('instructions')(descText);
                          setInstructions(descText);
                        }}
                        name="instructions"
                        value={instructions}
                        error={props.errors.instructions}
                        maxCharacters={750}
                      />
                    </View>
                    <Text style={styles.inputNotice}>
                      Briefly describe what information the fan should provide
                      so you can craft a reply.
                    </Text>
                  </View>
                )}
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
          <ButtonGroup
            disableNextBtn={last && !publishable}
            nextTitle={last ? 'Publish' : null}
            onBack={onBack}
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
  styledTextarea: {
    ...Inputs.stackedTextarea,
    marginTop: hp(1),
    fontSize: wp(4),
    minHeight: hp(20),
    textAlignVertical: 'top',
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
  nextButtonText: {
    ...Buttons.lightButtonText,
  },
  inputNotice: {
    ...Typography.cardsubTitle,
  },
  inputContainer: {
    ...Inputs.stackedInputWrapper,
    marginTop: 0,
  },
});
