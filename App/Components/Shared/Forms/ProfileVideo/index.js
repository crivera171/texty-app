/* eslint-disable max-lines */
import React, {useState, useEffect, useRef, useContext} from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {Formik} from 'formik';
import {Typography} from 'Styles';
import {COLORS} from 'Styles/colors.js';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {ProfileStore} from 'State/ProfileContext';
import MediaMeta from 'react-native-media-meta';
import * as FileSystem from 'expo-file-system';
import {Video} from 'expo-av';
import RNFS from 'react-native-fs';
import {request, PERMISSIONS} from 'react-native-permissions';
import {Menu} from '@/Components/Menu';
import {Alert} from 'react-native';
import placeholderImage from 'Assets/Images/placeholderProfile.png';
import tw from 'tw';
import {Icon} from 'react-native-elements';

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

const options = {
  title: 'Profile Intro',
  mediaType: 'video',
  durationLimit: 30,
  cameraType: 'front',
};

export const ProfileVideoForm = ({initialValues, onFormSubmit}) => {
  const [loading, setLoading] = useState(false);
  const [fileUri, setFileUri] = useState(false);
  const [video, setVideo] = useState(false);
  const [menu, setMenu] = useState(false);

  const formRef = useRef();
  const {actions} = useContext(ProfileStore);

  const handleVideoRef = async (component) => {
    setVideo(component);
  };

  useEffect(() => {
    if (initialValues.profile_video_url) {
      setFileUri(initialValues.profile_video_url);
    }
    setLoading(false);
  }, [initialValues]);

  const addInfo = (data) => {
    onFormSubmit({
      ...data,
      profile_video_url: fileUri,
    });
    setLoading(false);
  };

  const handleResponse = (response) => {
    if (response.didCancel) {
      setMenu(false);
      setLoading(false);
    } else if (response.error) {
      setMenu(false);
      setLoading(false);
    } else if (response.customButton) {
    } else {
      (async () => {
        try {
          setMenu(false);
          setLoading(true);
          let path = response.uri;
          if (Platform.OS === 'android') {
            path = await getRealPath(response.uri);
          }

          const {duration} = await MediaMeta.get(path.replace('file://', ''));
          const {size} = await FileSystem.getInfoAsync(path, {
            size: true,
          });

          const file_info = await actions.uploadProfileVideo(
            path,
            duration,
            size,
          );

          const fileLocation = await file_info.postResponse.location;
          setFileUri(fileLocation);
          if (formRef.current) {
            formRef.current.handleSubmit();
          }
          setLoading(false);
        } catch (err) {
          Alert.alert('Could not upload video');
          setLoading(false);
        }
      })();
    }
  };

  const takeVideo = async () => {
    const cameraPerm = await request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA,
    );
    if (cameraPerm === 'granted') {
      launchCamera(options, (response) => {
        handleResponse(response);
      });
    }
  };

  const chooseImage = () => {
    launchImageLibrary(options, (response) => {
      handleResponse(response);
    });
  };

  const toggleVideoPlayback = () => {
    if (!loading) {
      video.presentFullscreenPlayer();
      video.playAsync();
    }
  };

  return (
    <Formik
      initialValues={{
        profile_video_url: fileUri,
      }}
      onSubmit={addInfo}
      validateOnBlur={false}
      innerRef={formRef}>
      {() => (
        <View style={styles.videoContainer}>
          {fileUri ? (
            <TouchableWithoutFeedback onPress={toggleVideoPlayback}>
              <Video
                playsInSilentLockedModeIOS
                volume={1}
                resizeMode={Video.RESIZE_MODE_COVER}
                source={{
                  uri: fileUri,
                }}
                style={styles.video}
                onLoadStart={() => setLoading(true)}
                onLoad={() => setLoading(false)}
                onPlaybackStatusUpdate={(playbackStatus) => {
                  if (playbackStatus.didJustFinish) {
                    video.stopAsync();
                    video.dismissFullscreenPlayer();
                  }
                }}
                onFullscreenUpdate={(fullscreenStatus) => {
                  if (fullscreenStatus.fullscreenUpdate === 3) {
                    video.stopAsync();
                  }
                }}
                ref={handleVideoRef}
              />
            </TouchableWithoutFeedback>
          ) : (
            <Image style={[styles.video]} source={placeholderImage} />
          )}
          {loading ? (
            <View
              style={tw(
                'absolute right-0 left-0 top-0 bottom-0 items-center justify-center bg-light-gray rounded-full',
              )}>
              <ActivityIndicator size={30} color={COLORS.gray} />
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addPictureIconContainer}
              onPress={() => setMenu(true)}>
              <Icon
                type="ionicon"
                color={COLORS.black}
                size={wp(4)}
                name="videocam"
                style={styles.addPictureIcon}
              />
            </TouchableOpacity>
          )}

          <Menu
            isVisible={menu}
            onDismiss={() => setMenu(false)}
            title="Video Introduction"
            actions={[
              {
                icon: 'file-upload',
                name: 'Upload a video',
                color: COLORS.blue,
                onActionPress: () => {
                  chooseImage();
                },
              },
              {
                icon: 'videocam',
                name: 'Take a video',
                color: COLORS.blue,
                last: true,
                onActionPress: () => {
                  takeVideo();
                },
              },
            ]}
          />
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  uploadText: {
    ...Typography.subtitle,
    color: 'white',
  },
  video: {
    height: '100%',
    width: '100%',
    borderRadius: wp(40),
    alignContent: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
    backgroundColor: COLORS.white,
  },
  videoContainer: {
    backgroundColor: COLORS.white,
    borderRadius: wp(40),
    padding: 3,
    height: wp(25),
    width: wp(25),
  },
  addPictureIconContainer: {
    height: wp(8),
    width: wp(8),
    backgroundColor: COLORS.lightGray,
    borderRadius: wp(10),
    position: 'absolute',
    right: 0,
    bottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPictureIconContainerFull: {
    height: '100%',
    width: '100%',
    borderRadius: 50,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPictureIcon: {
    color: COLORS.white,
    fontSize: 20,
  },
  addPictureIconFull: {
    color: COLORS.white,
    fontSize: 70,
  },
});
