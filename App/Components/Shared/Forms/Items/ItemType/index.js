import React, {useState} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {Formik} from 'formik';
import {Inputs, Containers, Typography, Buttons} from '@/Styles';
import * as Yup from 'yup';
import {COLORS} from 'Styles/colors.js';
import {ButtonGroup} from '@/Components/Buttons/ButtonGroup';
import {ButtonGroup as SelectGroup} from 'react-native-elements';
import tw from 'tw';
import {Button} from 'react-native-elements';
import {Icon} from 'react-native-elements';

const ItemsSchema = Yup.object().shape({
  type: Yup.string().required('Enter a title for your item'),
});

const callTypes = ['phone', 'web'];
const itemTypes = [
  {
    label: 'Subscription',
    value: 'subscription',
    icon: 'vote-yea',
  },
  {
    label: 'Response',
    value: 'response',
    icon: 'comment',
  },
  {
    label: 'Meeting',
    value: 'call',
    icon: 'user-friends',
  },
  {
    label: 'Link',
    value: 'link',
    icon: 'link',
  },
  {
    label: 'Content',
    value: 'content',
    icon: 'file-invoice',
  },
];

export const ItemType = ({initialValues, onSubmit}) => {
  const [type, setType] = useState(initialValues.type || 'subscription');
  const [callType, setCallType] = useState(initialValues.call_type || 'phone');

  return (
    <Formik
      initialValues={{
        type,
        call_type: callType,
      }}
      onSubmit={onSubmit}
      validationSchema={ItemsSchema}
      validateOnBlur={false}>
      {(props) => (
        <>
          <View style={styles.formContainer}>
            <ScrollView
              contentContainerStyle={[
                Containers.container,
                tw('h-full border-b-0'),
              ]}>
              <Text style={styles.screenTitle}>Select an Item Type</Text>
              {itemTypes.map((itemType, idx) => (
                <View key={idx}>
                  <Button
                    buttonStyle={tw(
                      `rounded-full py-5 mt-3 ${
                        type === itemType.value ? 'bg-blue' : 'bg-white border'
                      }`,
                    )}
                    titleStyle={[
                      Typography.subtitle,
                      tw(
                        `${
                          type === itemType.value ? 'text-white' : 'text-blue'
                        }`,
                      ),
                    ]}
                    icon={
                      <Icon
                        type="font-awesome-5"
                        name={itemType.icon}
                        size={24}
                        style={tw('pr-2')}
                        color={
                          type === itemType.value ? COLORS.white : COLORS.blue
                        }
                        solid
                      />
                    }
                    onPress={() => {
                      setType(itemType.value);
                      props.handleChange('type')(itemType.value);
                    }}
                    title={itemType.label}
                  />
                  {itemType.value === 'call' && type === 'call' ? (
                    <View style={tw('my-3')}>
                      <SelectGroup
                        buttons={['Phone Call', 'Video Meeting']}
                        onPress={(id) => {
                          const meetingType = callTypes[id];
                          props.handleChange('call_type')(meetingType);
                          setCallType(meetingType);
                        }}
                        selectedIndex={callTypes.indexOf(callType)}
                        selectedButtonStyle={tw('bg-blue')}
                      />
                    </View>
                  ) : null}
                </View>
              ))}
            </ScrollView>
          </View>
          <ButtonGroup
            disableBackBtn
            onNext={() => {
              props.handleSubmit();
            }}
          />
        </>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  screenTitle: {
    ...Typography.title,
    ...tw('text-center py-3'),
  },
  inputPrefixContainer: {
    ...Inputs.stackedInput,
    borderColor: COLORS.inputBorderColor,
    paddingTop: 0,
    marginVertical: 15,
  },
  inputNote: {
    ...Typography.cardsubTitle,
    lineHeight: 22,
  },
  inputHint: {
    ...Inputs.inputNote,
    color: COLORS.black,
    marginTop: 25,
  },
  formContainer: {
    ...tw('w-full flex justify-between h-full flex-1 pt-0'),
  },
  nextButton: {
    ...Buttons.formButton,
  },
  nextButtonText: {
    ...Buttons.lightButtonText,
  },
  checkboxContainer: {
    ...Inputs.checkboxContainer,
  },
});
