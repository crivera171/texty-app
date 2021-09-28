import React, {useState, useMemo, useEffect} from 'react';
import {Icon} from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {StyleSheet, View, Text, TouchableWithoutFeedback} from 'react-native';
import {COLORS} from 'Styles/colors.js';
import {Typography} from 'Styles';
import {Menu} from '@/Components/Menu';
import tw from 'tw';
import {Error} from '../Error';

export const Picker = ({
  label,
  onChangeItem,
  values,
  defaultValue,
  placeholder,
  error,
  inputTextStyle,
  itemStyle,
  inputStyle,
  hideLabel,
  prefix,
}) => {
  const [visibility, setVisibility] = useState(false);
  const [inputText, setInputText] = useState(false);

  useEffect(() => {
    if (defaultValue) {
      const defaultItem = values.find((x) => x.value === defaultValue);
      setInputText(defaultItem.label);
    }
  }, [defaultValue]);

  const valuesToActions = useMemo(() => {
    const actions = [];
    values.map((item, idx) => {
      actions.push({
        name: item.label,
        color: COLORS.blue,
        onActionPress: () => {
          setInputText(item.label);
          onChangeItem(item.value);
          setVisibility(false);
        },
        last: idx === values.length - 1,
        itemStyle,
      });
    });

    return actions;
  }, [values]);

  return (
    <View style={[styles.container, hideLabel ? null : tw('mb-4')]}>
      <TouchableWithoutFeedback onPress={() => setVisibility(true)}>
        <View>
          {hideLabel ? null : (
            <Text style={[Typography.subtitle, tw('font-bold text-black')]}>
              {label}
            </Text>
          )}
          <View
            style={[
              styles.input,
              inputStyle,
              error ? styles.inputError : null,
            ]}>
            <Text style={[styles.inputLabel, inputTextStyle]}>
              <Text style={tw('font-bold text-black')}>{prefix}</Text>{' '}
              {inputText ? inputText : placeholder}
            </Text>
            <Icon
              color={COLORS.blue}
              size={wp(3)}
              type="antdesign"
              name="caretdown"
            />
          </View>
          <Error error={error} />
        </View>
      </TouchableWithoutFeedback>
      <Menu
        isVisible={visibility}
        onDismiss={() => setVisibility(false)}
        title={label}
        actions={valuesToActions}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    ...tw(
      'px-1 text-black flex-row items-center justify-between w-full border-gray bg-white mb-1 pt-3 pb-2',
    ),
  },
  inputLabel: {
    ...Typography.subtitle,
  },
  inputError: {
    borderColor: COLORS.red,
  },
  inputErrorText: {
    ...Typography.subtitle,
    color: COLORS.red,
    marginVertical: hp(0.3),
  },
});
