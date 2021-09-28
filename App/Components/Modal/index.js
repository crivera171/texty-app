import React, {useRef, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {COLORS} from 'Styles/colors.js';
import {Containers, Typography} from 'Styles';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import ActionSheet from 'react-native-actions-sheet';
import tw from 'tw';

const styles = StyleSheet.create({
  indicator: {
    height: 8,
    width: 70,
    ...tw('bg-gray rounded-full'),
  },
  container: {
    maxHeight: hp(80),
    ...tw('bg-light-gray'),
  },
  modalInner: {
    ...tw('bg-light-gray w-full'),
    borderTopLeftRadius: 10,
    borderTopEndRadius: 10,
  },
  actionsContainer: {
    ...Containers.container,
    ...tw('py-0'),
  },
  actionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 5,
    paddingVertical: hp(2.5),
  },
  actionName: {
    ...Typography.subtitle,
  },
  actionIcon: {
    paddingRight: 20,
  },
  modalHeader: {
    ...Containers.section,
    ...tw('pb-4 pt-5 px-5 mt-0 flex-row justify-between items-center'),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  actionCancelText: {
    ...Typography.subtitle,
    color: COLORS.blue,
  },
  modalHeaderTitle: Typography.title,
  safeAreaBackground: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  emptyText: {
    ...Typography.subtitle,
    textAlign: 'center',
    paddingVertical: 30,
  },
});

export const Modal = ({
  isVisible,
  onDismiss,
  children,
  title,
  containerStyle,
}) => {
  const actionSheetRef = useRef();

  useEffect(() => {
    if (isVisible) {
      actionSheetRef.current?.setModalVisible(true);
    } else {
      actionSheetRef.current?.setModalVisible(false);
    }
  }, [isVisible, actionSheetRef]);

  return (
    <ActionSheet
      indicatorColor={COLORS.lightGray}
      onClose={onDismiss}
      CustomHeaderComponent={
        <View style={styles.modalHeader}>
          <View style={tw('absolute top-0 left-0 right-0 items-center mt-1')}>
            <View style={styles.indicator} />
          </View>
          <Text style={styles.modalHeaderTitle}>{title}</Text>
          <TouchableOpacity onPress={onDismiss}>
            <Text style={styles.actionCancelText}>Done</Text>
          </TouchableOpacity>
        </View>
      }
      gestureEnabled
      ref={actionSheetRef}
      extraScroll={100}
      containerStyle={styles.modalInner}>
      <View style={styles.container}>{children}</View>
      <SafeAreaView style={styles.safeAreaBackground} />
    </ActionSheet>
  );
};
