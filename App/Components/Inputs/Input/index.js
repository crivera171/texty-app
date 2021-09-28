/* eslint-disable max-lines */
import React, {useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
  FlatList,
} from 'react-native';
import {ListItem, Icon, Tooltip} from 'react-native-elements';
import {COLORS} from 'Styles/colors.js';
import {Typography} from 'Styles';
import TextInputMask from 'react-native-text-input-mask';
import tw from 'tw';
import {PriceInput} from '../PriceInput';
import {Error} from '../Error';

export const Input = ({
  label,
  labelStyle,
  prefix,
  renderPrefix,
  error,
  onChangeText,
  defaultValue,
  renderRight,
  placeholder,
  mask,
  keyboardType,
  value,
  multiline,
  numberOfLines,
  isSearch,
  searchResults,
  onSearchResultPress,
  itemContainerStyle,
  icon,
  tooltip,
  type,
  maxCharacters,
}) => {
  const [hidePassword, setHidePassword] = useState(type === 'password');
  const [isFocused, setIsFocused] = useState(false);

  const renderItem = ({item}) => (
    <ListItem
      underlayColor={COLORS.white}
      onPress={() => onSearchResultPress(item)}
      bottomDivider
      containerStyle={tw('py-3')}>
      <ListItem.Content>
        <ListItem.Title style={Typography.notice}>{item.label}</ListItem.Title>
      </ListItem.Content>
    </ListItem>
  );

  const keyExtractor = (item, index) => index.toString();

  return (
    <View style={[tw('relative'), label ? tw('mb-4') : null]}>
      {label ? (
        <Text
          style={[Typography.subtitle, tw('font-bold text-black'), labelStyle]}>
          {label}
        </Text>
      ) : null}
      <View
        style={[
          styles.inputContainer,
          itemContainerStyle,
          error ? tw('border-red') : null,
          isFocused ? tw('border-blue') : null,
        ]}>
        {icon ? (
          <View style={tw('justify-center items-center pr-3 pt-1')}>
            <Icon
              type="font-awesome-5"
              size={wp(4)}
              color={COLORS.gray}
              name={icon}
              solid
            />
          </View>
        ) : null}
        {renderPrefix ? (
          renderPrefix
        ) : prefix ? (
          <Text style={styles.prefix}>{prefix}</Text>
        ) : null}
        {mask ? (
          <TextInputMask
            secureTextEntry={hidePassword}
            placeholder={placeholder}
            defaultValue={defaultValue}
            onChangeText={(inputValue) => onChangeText(inputValue)}
            style={styles.input}
            mask={mask}
            keyboardType={keyboardType}
            value={String(value)}
            onFocus={() => {
              setIsFocused(true);
            }}
            onBlur={() => {
              setIsFocused(false);
            }}
          />
        ) : type !== 'price' ? (
          <TextInput
            value={value}
            keyboardType={keyboardType}
            secureTextEntry={hidePassword}
            placeholder={placeholder}
            defaultValue={defaultValue}
            onChangeText={(inputValue) => onChangeText(inputValue)}
            style={[styles.input, multiline ? styles.textArea : null]}
            multiline={multiline}
            numberOfLines={numberOfLines}
            minHeight={
              Platform.OS === 'ios' && numberOfLines ? 20 * numberOfLines : null
            }
            onFocus={() => {
              setIsFocused(true);
            }}
            onBlur={() => {
              setIsFocused(false);
            }}
          />
        ) : (
          <PriceInput
            onFocus={() => {
              setIsFocused(true);
            }}
            onBlur={() => {
              setIsFocused(false);
            }}
            value={value}
            onChange={onChangeText}
            error={error}
          />
        )}
        <View style={tw(`pt-1 relative ${maxCharacters ? 'h-full' : ''}`)}>
          {renderRight}
          {tooltip ? (
            <Tooltip
              withOverlay={false}
              height={hp(8)}
              width={wp(80)}
              backgroundColor={COLORS.blue}
              popover={
                <Text
                  style={[Typography.notice, tw('text-white')]}
                  numberOfLines={2}>
                  {tooltip}
                </Text>
              }>
              <Icon
                type="font-awesome-5"
                size={wp(4.5)}
                color={COLORS.blue}
                name="question-circle"
                solid
              />
            </Tooltip>
          ) : null}

          {type === 'password' ? (
            <Icon
              type="font-awesome-5"
              size={wp(4.5)}
              color={COLORS.blue}
              style={styles.inputIconRight}
              onPress={() => setHidePassword(!hidePassword)}
              name={hidePassword ? 'eye' : 'eye-slash'}
              solid
            />
          ) : null}
          {maxCharacters ? (
            <Text style={tw('text-blue absolute bottom-0 right-0 p-1')}>
              {value.length}/{maxCharacters}
            </Text>
          ) : null}
        </View>
      </View>

      <Error error={error} />
      {isSearch && searchResults && searchResults.length ? (
        <View style={styles.searchContainer}>
          <FlatList
            keyExtractor={keyExtractor}
            data={searchResults}
            renderItem={renderItem}
          />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  prefix: {
    ...Typography.subtitle,
    ...tw('font-bold text-black pt-1 pr-1'),
  },
  searchContainer: {
    height: 200,
    ...tw('w-full top-0 bottom-0 right-0 left-0 border-gray px-2'),
    borderWidth: 1,
  },
  searchItemText: {
    color: COLORS.black,
  },
  inputContainer: {
    borderBottomWidth: 1,
    ...tw(
      'px-1 text-black flex-row items-center justify-between w-full border-gray bg-white mb-1',
    ),
  },
  textArea: {
    textAlignVertical: 'top',
    paddingVertical: hp(2),
  },
  inputError: {
    borderColor: COLORS.red,
  },
  inputErrorText: {
    fontSize: wp(3.5),
    color: COLORS.red,
    marginVertical: hp(0.3),
  },
  input: {
    ...Typography.subtitle,
    ...tw('flex-1 h-full pt-3 pb-2'),
  },
});
