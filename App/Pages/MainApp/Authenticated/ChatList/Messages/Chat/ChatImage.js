import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from 'react-native';
import Lightbox from 'react-native-lightbox';
import {Icon, Image} from 'react-native-elements';
import ScalableImage from 'react-native-scalable-image';
import {COLORS} from 'Styles/colors.js';

export const ChatImage = (props) => {
  return (
    <>
      {props.currentMessage.image ? (
        <Lightbox
          springConfig={{
            overshootClamping: true,
          }}
          renderHeader={(close) => (
            <SafeAreaView>
              <TouchableOpacity
                onPress={close}
                style={styles.closeBtnContainer}>
                <Icon
                  style={styles.actionIcon}
                  size={28}
                  color={'#fff'}
                  type="ionicon"
                  name="ios-chevron-back"
                />
                <Text style={styles.closeButton}>Close</Text>
              </TouchableOpacity>
            </SafeAreaView>
          )}
          renderContent={() => (
            <ScalableImage
              width={Dimensions.get('window').width}
              source={{uri: props.currentMessage.image}}
            />
          )}>
          <Image
            style={styles.imagePreview}
            source={{uri: props.currentMessage.image}}
            PlaceholderContent={
              <ActivityIndicator color={COLORS.white} />
            }
          />
        </Lightbox>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  closeBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  closeButton: {
    fontSize: 18,
    color: '#fff',
  },
  imagePreview: {
    overflow: 'hidden',
    height: 300,
    width: 280,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
