import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {COLORS} from '@/Styles/colors.js';
import {Containers, Typography} from '@/Styles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Icon} from 'react-native-elements';

export const SelectableCards = ({cards, onSelect, selected}) => (
  <View style={styles.cardsContainer}>
    {cards.map((card, idx) => (
      <TouchableOpacity
        key={idx}
        activeOpacity={1}
        style={styles.cardWrapper}
        onPress={() => onSelect(card.value)}>
        <View
          style={[styles.card, card.value === selected && styles.activeCard]}>
          <Icon
            type="ionicon"
            size={wp(5)}
            color={COLORS.white}
            style={styles.cardIcon}
            name={card.icon}
          />
          <Text style={styles.cardLabel}>{card.label}</Text>
        </View>
      </TouchableOpacity>
    ))}
  </View>
);

const styles = StyleSheet.create({
  cardWrapper: {
    width: '30%',
  },
  cardsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(3),
  },
  cardLabel: {
    ...Typography.subtitle,
    textAlign: 'center',
    color: COLORS.white,
  },
  cardIcon: {
    borderRadius: 5,
    padding: 3,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  card: {
    ...Containers.flexCenter,
    backgroundColor: COLORS.blue,
    borderRadius: 8,
    width: '100%',
    minHeight: hp(9),
    elevation: 0,
  },
  activeCard: {
    backgroundColor: COLORS.secondary,
  },
});
