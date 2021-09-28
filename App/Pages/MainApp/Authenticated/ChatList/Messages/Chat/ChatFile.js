import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Linking} from 'react-native';
import {Icon} from 'react-native-elements';
import {COLORS} from 'Styles/colors';

export const ChatFile = (props) => {
  return (
    <TouchableOpacity
      onPress={async () => await Linking.openURL(props.currentMessage.file)}>
      {props.currentMessage.file ? (
        <View style={styles.fileContainer}>
          <Icon
            style={styles.fileIcon}
            size={28}
            color={'#fff'}
            type="material-community"
            name="file"
          />
          <View>
            <Text style={styles.fileDownloadText}>Download</Text>
            <Text style={styles.fileDownloadMetaText}>File</Text>
          </View>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fileContainer: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileIcon: {
    borderRadius: 1000,
    backgroundColor: COLORS.blue,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileDownloadText: {
    fontSize: 18,
    marginLeft: 10,
    color: COLORS.blue,
  },
  fileDownloadMetaText: {
    fontSize: 14,
    marginLeft: 10,
    color: COLORS.darkGray,
  },
});
