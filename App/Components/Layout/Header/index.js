import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import {COLORS} from 'Styles/colors.js';
import {Containers, Typography, Buttons} from 'Styles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import tw from 'tw';

const styles = StyleSheet.create({
  header: {
    ...Containers.container,
    ...tw(
      'bg-white w-full flex-row justify-between items-center z-10 relative',
    ),
    height: hp(7),
  },
  activeTab: {
    ...Typography.title,
    ...tw('text-center font-bold flex-1 text-black'),
  },
  controls: {
    ...Buttons.transparentButton,
    width: wp(25),
    ...tw('text-center h-full justify-center'),
  },
  controlsText: {
    ...Typography.subtitle,
    ...tw('text-blue text-center'),
  },
  safeAreaContainer: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: COLORS.white,
  },
});

export const Header = ({
  title,
  titleSize,
  titleNumberLine = 1,
  handleBack,
  backTitle,
  doneTitle,
  doneIcon,
  handleDone,
  loading,
  hideDone,
  hideBack,
  renderRightSide,
  renderTitle,
  headerStyle,
  textColor,
  alwaysEnableBackButton = false,
}) => {
  const [isBackPressed, setIsBackPressed] = useState(false);

  const onBack = () => {
    if (!alwaysEnableBackButton) {
      setIsBackPressed(true);
    }
    handleBack();
  };
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={[styles.header, headerStyle]}>
        {!hideBack ? (
          <TouchableOpacity
            disabled={isBackPressed || loading}
            onPress={onBack}
            style={styles.controls}>
            <Text
              style={[
                styles.controlsText,
                tw('text-left'),
                {color: textColor || COLORS.blue},
              ]}>
              {backTitle || 'Back'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.controls} />
        )}
        {renderTitle ? (
          renderTitle
        ) : (
          <Text
            numberOfLines={titleNumberLine}
            style={[
              styles.activeTab,
              titleSize ? {fontSize: titleSize} : null,
              {color: textColor || COLORS.black},
            ]}>
            {title}
          </Text>
        )}
        {!hideDone ? (
          !renderRightSide ? (
            <TouchableOpacity
              disabled={loading}
              onPress={handleDone}
              style={styles.controls}>
              {loading ? (
                <View style={tw('w-full flex-row justify-end items-center')}>
                  <ActivityIndicator
                    size={25}
                    color={textColor || COLORS.blue}
                  />
                </View>
              ) : (
                <View style={tw('w-full flex-row justify-end items-center')}>
                  <Text
                    style={[
                      styles.controlsText,
                      tw('text-right'),
                      {color: textColor || COLORS.blue},
                    ]}>
                    {doneTitle || 'Done'}
                  </Text>
                  {doneIcon}
                </View>
              )}
            </TouchableOpacity>
          ) : (
            renderRightSide
          )
        ) : (
          <View style={styles.controls} />
        )}
      </View>
    </SafeAreaView>
  );
};
