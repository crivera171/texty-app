import React, {useState} from 'react';
import {View, StyleSheet, Text, Keyboard, ScrollView} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {Typography, Containers} from 'Styles';
import {FormButton} from '@/Components/Buttons/Button';
import {Input} from '@/Components/Inputs/Input';
import tw from 'tw';

const RefSchema = Yup.object().shape({
  ref_source: Yup.string().required('Cannot be blank'),
});

export const StoryForm = ({loading, initialValues = {}, onFormSubmit}) => {
  const [validatingRealTime, setValidatingRealTime] = useState(false);

  const [refSource, setRefSource] = useState(initialValues.ref_source || '');

  return (
    <Formik
      initialValues={{ref_source: refSource}}
      onSubmit={onFormSubmit}
      validationSchema={RefSchema}
      validateOnBlur={false}
      validateOnChange={validatingRealTime}>
      {(props) => (
        <View style={tw('h-full')}>
          <ScrollView>
            <View style={tw('p-5 flex-1')}>
              <View style={styles.pageTitleContainer}>
                <Text style={styles.pageTitle}>How did you hear about us?</Text>
              </View>
              <View style={styles.pageSubtitleContainer}>
                <Text style={styles.pageSubtitle}>
                  We use this information to improve Texty so we can better
                  serve the creator community
                </Text>
              </View>
              <Input
                multiline
                numberOfLines={8}
                placeholder="Type..."
                value={refSource}
                onChangeText={(refSourceText) => {
                  props.handleChange('ref_source')(refSourceText);
                  setRefSource(refSourceText);
                }}
                error={props.errors.ref_source}
              />
            </View>
          </ScrollView>
          <View style={styles.buttonContainer}>
            <View style={tw('w-1/4')}>
              <FormButton
                loading={loading}
                full
                onPress={() => {
                  Keyboard.dismiss();
                  props.handleSubmit();
                  setValidatingRealTime(true);
                }}
                title="Next"
              />
            </View>
          </View>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  pageTitleContainer: Containers.titleContainer,
  pageSubtitleContainer: Containers.subtitleContainer,
  pageTitle: {
    ...Typography.title,
  },
  pageSubtitle: {
    ...Typography.subtitle,
    ...tw('my-1'),
  },
  buttonContainer: {
    ...tw(
      'w-full flex-row items-center justify-end border-t px-5 py-2 bg-white',
    ),
    borderColor: '#E8E8E8',
  },
});
