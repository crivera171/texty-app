import React, {useState} from 'react';
import {View, StyleSheet, Keyboard} from 'react-native';
import {Formik} from 'formik';
import {Containers} from 'Styles';
import * as Yup from 'yup';
import {Header} from '@/Components/Layout/Header';
import {Input} from '@/Components/Inputs/Input';
import {Picker} from '@/Components/Inputs/Picker';
import {platforms, reachValues, platformLink} from './constants/index';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import tw from 'tw';

export const SocialMediaForm = ({initialValues, onFormSubmit, onDismiss}) => {
  const [platform, setPlatform] = useState(
    initialValues.platform || 'facebook',
  );
  const [reach, setReach] = useState(initialValues.reach || 'Less than 1K');
  const [handle, setHandle] = useState(initialValues.handle || '');
  const [loading, setLoading] = useState(false);

  const ProfileSchema = Yup.object().shape({
    platform: Yup.string().required('This field is required'),
    reach: Yup.string().required('This field is required'),
    handle: Yup.string().required('This field is required'),
  });

  return (
    <Formik
      initialValues={{
        platform,
        reach,
        handle,
        id: initialValues.id,
      }}
      onSubmit={onFormSubmit}
      validateOnBlur={false}
      validationSchema={ProfileSchema}>
      {(props) => (
        <View style={styles.pageContainer}>
          <Header
            title={initialValues.id ? 'Edit Social Media' : 'Add Social Media'}
            backTitle="Close"
            handleBack={onDismiss}
            loading={loading}
            handleDone={async () => {
              setLoading(true);
              Keyboard.dismiss();
              const res = await props.validateForm();

              if (Object.keys(res).length === 0) {
                props.handleSubmit();
              }
              setLoading(false);
            }}
          />
          <View style={styles.container}>
            <Picker
              label="Platform"
              values={platforms}
              onChangeItem={(itemValue) => {
                props.setFieldValue('platform', itemValue);
                setPlatform(itemValue);
              }}
              defaultValue={platform}
              placeholder="Select"
              error={props.errors.platform}
            />

            <Picker
              label="Reach"
              values={reachValues}
              onChangeItem={(itemValue) => {
                props.setFieldValue('reach', itemValue);
                setReach(itemValue);
              }}
              placeholder="Select"
              defaultValue={reach}
              error={props.errors.reach}
            />

            <Input
              label="Handle"
              prefix={platformLink[platform].link}
              onChangeText={(handleText) => {
                props.handleChange('handle')(handleText);
                setHandle(handleText);
              }}
              defaultValue={handle}
              error={props.errors.handle}
            />
          </View>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  prefix: {
    fontSize: wp(4),
    paddingRight: wp(2),
    textAlignVertical: 'center',
  },
  container: {
    ...Containers.container,
    ...tw('h-full pt-5'),
  },
});
