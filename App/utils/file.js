import {Platform} from 'react-native';
import MediaMeta from 'react-native-media-meta';
import * as FileSystem from 'expo-file-system';
import RNFS from 'react-native-fs';
import {request, PERMISSIONS} from 'react-native-permissions';

const getRealPath = async (contentUri) => {
  const readStoragePerm = await request(
    PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
  );
  const writeStoragePerm = await request(
    PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
  );
  if (readStoragePerm === 'granted' && writeStoragePerm === 'granted') {
    const {originalFilepath} = await RNFS.stat(contentUri);

    return 'file://' + originalFilepath;
  }
};

export const handleMediaURI = async (response) => {
  try {
    let path = response.uri;
    if (Platform.OS === 'android') {
      path = await getRealPath(response.uri);
    }

    const {duration} = await MediaMeta.get(path.replace('file://', ''));
    const {size} = await FileSystem.getInfoAsync(path, {
      size: true,
    });

    return {path, duration, size};
  } catch (err) {
    throw err;
  }
};
