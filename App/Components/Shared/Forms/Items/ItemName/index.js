import React, {useState} from 'react';
import {
  View,
  Keyboard,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {Formik} from 'formik';
import {Containers, Typography} from '@/Styles';
import * as Yup from 'yup';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {Input} from '@/Components/Inputs/Input';
import {ButtonGroup} from '@/Components/Buttons/ButtonGroup';
import tw from 'tw';

const ItemsSchema = Yup.object().shape({
  name: Yup.string().required('Enter a title for your item'),
  hashtag: Yup.string().when('type', {
    is: (val) => val !== 'link',
    then: Yup.string().required('Enter a hashtag for your item'),
  }),
});

export const ItemName = ({initialValues, onBack, onSubmit, loading}) => {
  const [name, setName] = useState(initialValues.name || '');
  const [hashtag, setHashtag] = useState(initialValues.hashtag || '');
  const [validatingRealTime, setValidatingRealTime] = useState(false);

  return (
    <Formik
      initialValues={{
        name,
        hashtag,
        type: initialValues.type,
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
                <Input
                  onChangeText={(nameText) => {
                    props.handleChange('name')(nameText);
                    setName(nameText);
                  }}
                  defaultValue={name}
                  value={name}
                  prefix={''}
                  prefixStyle={styles.prefix}
                  label={
                    initialValues.type === 'link'
                      ? 'Link title'
                      : 'What will you do for your fans?'
                  }
                  labelStyle={styles.screenTitle}
                  error={props.errors.name}
                  tooltip={
                    initialValues.type === 'link'
                      ? null
                      : 'Try to keep it short, this will be the name of your item.'
                  }
                />

                {initialValues.type === 'link' ? null : (
                  <Input
                    onChangeText={(hashtagText) => {
                      hashtagText = hashtagText.replace(/[^A-Z0-9]/gi, '');
                      props.handleChange('hashtag')(hashtagText);
                      setHashtag(hashtagText);
                    }}
                    defaultValue={hashtag}
                    value={hashtag}
                    prefix={'#'}
                    prefixStyle={styles.prefix}
                    label={'Hashtag'}
                    labelStyle={styles.screenTitle}
                    error={props.errors.hashtag}
                    tooltip={
                      initialValues.type === 'link'
                        ? null
                        : 'Fans can access your items by sending hashtags to your Texty number'
                    }
                  />
                )}
              </ScrollView>
            </KeyboardAvoidingView>
          </View>

          <View>
            <ButtonGroup
              onBack={onBack}
              loading={loading}
              onNext={() => {
                Keyboard.dismiss();
                props.handleSubmit();
                setValidatingRealTime(true);
              }}
            />
          </View>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    ...tw('flex-1 h-full'),
  },
  screenTitle: {
    ...Typography.cardTitle,
  },
  inputNotice: {
    ...Typography.notice,
    marginTop: 10,
  },
  formContainer: {
    ...Containers.tabPageContainer,
    ...tw('w-full flex h-full flex-1 pt-0'),
  },
  prefix: {
    ...Typography.subtitle,
    fontWeight: '700',
    paddingRight: wp(2),
    textAlignVertical: 'center',
  },
  inputContainer: {
    marginTop: 20,
  },
});
