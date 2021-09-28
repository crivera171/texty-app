/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {COLORS} from 'Styles/colors.js';
import {Typography} from 'Styles';
import {Icon} from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ActionSheet from 'react-native-actions-sheet';
import {FlatList} from 'react-native-gesture-handler';
import tw from 'tw';

const styles = StyleSheet.create({
  listContainer: {
    maxHeight: hp(50),
  },
  modalInner: {
    backgroundColor: COLORS.white,
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopEndRadius: 10,
  },
  actionsContainer: {
    ...tw('px-5'),
    paddingVertical: wp(3.4),
  },
  actionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 5,
    paddingVertical: hp(2),
  },
  actionName: {
    ...Typography.subtitle,
  },
  actionIcon: tw('pr-3'),
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...tw('pb-4'),
  },
  actionCancelText: {
    ...Typography.subtitle,
    color: COLORS.blue,
  },
  modalHeaderTitle: Typography.title,
  safeAreaBackground: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  emptyText: {
    ...Typography.subtitle,
    textAlign: 'center',
    paddingVertical: 30,
  },
});

const Item = ({icon, name, color, type, last, onActionPress, itemStyle}) => (
  <TouchableOpacity onPress={onActionPress} style={styles.actionContainer}>
    <View style={[styles.actionWrapper, last && {borderColor: 'transparent'}]}>
      <Icon style={styles.actionIcon} size={wp(5)} color={color} name={icon} />
      <Text
        style={[styles.actionName, type === 'delete' && {color}, itemStyle]}>
        {name}
      </Text>
    </View>
  </TouchableOpacity>
);

export const Menu = ({isVisible, onDismiss, actions, title}) => {
  const renderItem = (props) => <Item {...props.item} />;
  const actionSheetRef = useRef();
  const scrollViewRef = useRef();

  useEffect(() => {
    if (isVisible) {
      actionSheetRef.current?.setModalVisible(true);
    } else {
      actionSheetRef.current?.setModalVisible(false);
    }
  }, [isVisible, actionSheetRef]);

  return (
    <ActionSheet
      onClose={onDismiss}
      gestureEnabled
      ref={actionSheetRef}
      extraScroll={100}
      containerStyle={styles.modalInner}>
      <View style={styles.actionsContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalHeaderTitle}>{title}</Text>
          <TouchableOpacity onPress={onDismiss}>
            <Text style={styles.actionCancelText}>Done</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.listContainer}>
          {actions && actions.length ? (
            <FlatList
              nestedScrollEnabled
              data={actions}
              keyExtractor={(item) => item.name}
              ref={scrollViewRef}
              renderItem={renderItem}
              onScrollEndDrag={() =>
                actionSheetRef.current?.handleChildScrollEnd()
              }
              onScrollAnimationEnd={() =>
                actionSheetRef.current?.handleChildScrollEnd()
              }
              onMomentumScrollEnd={() =>
                actionSheetRef.current?.handleChildScrollEnd()
              }
            />
          ) : (
            <Text style={styles.emptyText}>Nothing found</Text>
          )}
        </View>
      </View>
      <SafeAreaView style={styles.safeAreaBackground} />
    </ActionSheet>
  );
};
