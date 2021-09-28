import React, {useState, useEffect} from 'react';
import {Platform, StyleSheet, TextInput, View, Text} from 'react-native';
import {COLORS} from '@/Styles/colors.js';
import {formatPrice} from 'utils/number';
import {Typography} from 'Styles';
import tw from 'tw';

/**
 * Custom made price input component, with react native only
 *
 * @param value
 * @param onChange
 * @param width
 * @param error
 * @returns {JSX.Element}
 * @constructor
 */
export const PriceInput = ({
  onFocus,
  onBlur,
  value,
  onChange,
  width,
  error,
}) => {
  const [price, setPrice] = useState(`${value ?? '0'}`);

  // Report price change to parent component
  useEffect(() => {
    onChange(price);
  }, [price]);

  const onNewCharEnter = (val) => {
    // Text being deleted
    if (val.length < price.length) {
      setPrice(
        val.length < 1 ? '0' : `${price.substring(0, price.length - 1)}`,
      );
      return;
    }

    // Entered char not number
    const character = val.split(price).join('');
    if (isNaN(character)) {
      return;
    }

    if (price === '0') {
      setPrice(val.slice(-1));
      return;
    }

    // Set new value
    setPrice(`${val}`);
  };

  return (
    <View style={[styles.inputRoot, width && {width}]}>
      <View
        // horizontal
        style={[styles.buttonContainer, error && {borderColor: COLORS.red}]}>
        <Text style={styles.priceText}>{formatPrice(price)}</Text>
        <TextInput
          onFocus={onFocus}
          onBlur={onBlur}
          caretHidden
          onChangeText={onNewCharEnter}
          style={styles.realInput}
          defaultValue="0"
          keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
          name="price"
          value={price}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputRoot: {
    ...tw('w-full relative'),
    flexDirection: 'row-reverse',
    alignItems: 'stretch',
  },
  realInput: tw('w-full h-full absolute top-0 bottom-0 opacity-0'),
  buttonContainer: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  icon: {
    color: 'white',
    fontWeight: '700',
  },
  priceText: {...Typography.subtitle, ...tw('pt-3 pb-2')},
  valueContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
