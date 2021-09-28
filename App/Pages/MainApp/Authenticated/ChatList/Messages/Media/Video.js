import React, {useEffect} from 'react';
import {Platform, Alert} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import {request, PERMISSIONS} from 'react-native-permissions';
import {handleMediaURI} from '@/utils/file';
import {useMediaUploader} from 'Pages/MainApp/Authenticated/ChatList/Messages/Media/hooks';

const options = {
  title: 'Profile Intro',
  mediaType: 'video',
  durationLimit: 240,
  cameraType: 'front',
};

export const VideoChatComponent = () => {
  const {hide, handleMedia} = useMediaUploader();

  const takeVideo = async () => {
    const cameraPerm = await request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA,
    );
    if (cameraPerm === 'granted') {
      launchCamera(options, async (response) => {
        if (response.error) {
          Alert.alert('Could not upload video');
        }
        if (response.didCancel) {
          hide();
        } else if (response.customButton) {
        } else {
          try {
            const fileInfo = await handleMediaURI(response);
            await handleMedia(fileInfo);
            hide();
          } catch {
            Alert.alert('Could not upload video');
          }
        }
      });
    }
  };

  useEffect(() => {
    takeVideo();
  }, []);
  return <></>;
};
