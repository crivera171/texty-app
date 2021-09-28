import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {Containers} from 'Styles';
import {COLORS} from 'Styles/colors.js';
import {Icon} from 'react-native-elements';
import Clipboard from '@react-native-clipboard/clipboard';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import tw from 'tw';
export const CopyTextDisplay = ({text, formatAsPhone, containerStyle}) => {
  const [copied, setCopied] = useState(false);

  const formattedPhone = (str) => {
    //Filter only numbers from the input
    const cleaned = ('' + str).replace(/\D/g, '');

    //Check if the input is of correct
    const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);

    if (match) {
      //Remove the matched extension code
      //Change this to format for any country code.
      const intlCode = match[1] ? '+1 ' : '';
      return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
    }

    return str;
  };

  const copy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1100);
  };

  const copyToClipboard = (textToCopy) => {
    Clipboard.setString(textToCopy);
    copy();
  };

  return (
    <TouchableOpacity
      style={[styles.copyContainer, containerStyle]}
      onPress={() => copyToClipboard(text)}>
      <View style={styles.textContainer}>
        <Text numberOfLines={1} style={[styles.textStyle, styles.phoneText]}>
          {formatAsPhone ? formattedPhone(text) : text}
        </Text>
      </View>
      <View style={styles.iconContainer}>
        {copied ? (
          <Icon
            type="material-community"
            size={14}
            color={COLORS.blue}
            name="check-all"
          />
        ) : (
          <Icon type="feather" size={14} color={COLORS.blue} name="copy" />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  copyContainer: {
    ...tw('flex flex-row'),
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: `${COLORS.blue}22`,
    borderRadius: 10,
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    flex: 1,
    position: 'relative',
  },
  iconContainer: {
    width: '10%',
  },
  textContainer: {
    overflow: 'hidden',
    textAlign: 'left',
    width: '90%',
  },
  textStyle: {
    color: COLORS.blue,
    fontSize: wp(3.4),
    flexWrap: 'nowrap',
    flex: 1,
  },
});
