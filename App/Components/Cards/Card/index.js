import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Containers, Typography} from 'Styles';
import {Icon, Button} from 'react-native-elements';
import tw from 'tw';
import {COLORS} from 'Styles/colors.js';

export const Card = ({
  onPress,
  onLongPress,
  renderIcon,
  title,
  description,
  draggable,
  containerStyle,
  hasBtn,
  onBtnPress,
  btnTitle,
  disabled,
  loading,
}) => (
  <TouchableOpacity
    style={[styles.planBox, containerStyle]}
    onPress={onPress}
    disabled={disabled || loading}
    onLongPress={onLongPress}>
    <View style={styles.info}>
      <View style={styles.planTextContainer}>
        {renderIcon}
        <Text numberOfLines={1} style={styles.planTitle}>
          {title}
        </Text>
        {loading ? <ActivityIndicator color={COLORS.blue} /> : null}
        {draggable ? (
          <View style={tw('flex-row justify-end w-1/5')}>
            <Icon
              type="font-awesome-5"
              name="grip-lines"
              size={14}
              color="#E8E8E8"
            />
          </View>
        ) : null}
      </View>
      <View style={styles.planTextContainer}>
        <Text style={styles.planInfo}>{description}</Text>
      </View>
    </View>
    {hasBtn ? (
      <Button
        onPress={onBtnPress}
        disabled={loading}
        loading={loading}
        icon={
          <Icon
            type="font-awesome-5"
            name="plus-circle"
            style={tw('pr-2')}
            size={18}
            color={COLORS.white}
          />
        }
        title={btnTitle}
        titleStyle={tw('text-white')}
        disabledStyle={tw('bg-blue')}
        buttonStyle={tw('py-3 px-3 bg-blue')}
        containerStyle={tw(
          'rounded-full border-2 border-blue bg-blue mr-1 w-full mt-4',
        )}
      />
    ) : null}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  info: tw('flex-1 w-full'),
  planTitle: {
    ...Typography.title,
    ...tw('pl-3 flex-1'),
  },
  planInfo: {
    ...Typography.subtitle,
    ...tw('mt-2'),
  },
  planBox: {
    ...tw(
      'p-5 rounded-lg mb-4 bg-white w-full overflow-hidden flex-row overflow-hidden flex-wrap',
    ),
    width: '100%',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: COLORS.gray,
    minHeight: 80,
  },
  planLoader: {
    ...Containers.activeInformationContainer,
    ...Containers.flexCenter,
    width: '100%',
  },
  planTextContainer: {
    ...tw('flex-row items-center'),
  },
  listItemStyle: {
    ...Containers.listItem,
  },
});
