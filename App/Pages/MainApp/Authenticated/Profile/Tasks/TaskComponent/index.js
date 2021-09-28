import React from 'react';
import {TouchableOpacity, StyleSheet, View, Text} from 'react-native';
import {Icon} from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const TaskComponent = ({data}) => {
  return (
    <TouchableOpacity
      onPress={data.onPress}
      style={[styles.box, {borderColor: `${data.color}20`}]}>
      <Icon
        style={[styles.boxIcon, {backgroundColor: `${data.color}20`}]}
        type="ionicon"
        size={20}
        color={`${data.color}80`}
        name={data.icon}
      />
      <Text style={[styles.boxTitle, {color: `${data.color}`}]}>
        {data.name}
      </Text>
      <View style={styles.boxControls}>
        <Icon
          style={{color: `${data.color}`}}
          type="ionicon"
          size={15}
          color={data.color}
          name="arrow-forward"
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
    borderRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp(0.4),
    overflow: 'hidden',
  },
  boxIcon: {
    padding: wp(4),
    marginRight: wp(4),
  },
  boxTitle: {
    fontWeight: '700',
    fontSize: wp(3.5),
  },
  boxControls: {
    paddingRight: wp(3),
    flex: 1,
    alignItems: 'flex-end',
  },
});
