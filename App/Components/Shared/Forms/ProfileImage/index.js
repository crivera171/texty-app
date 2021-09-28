/* eslint-disable max-lines */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Text,
} from 'react-native';
import {Formik} from 'formik';
import {Containers, Typography} from 'Styles';
import {COLORS} from 'Styles/colors.js';
import {launchImageLibrary} from 'react-native-image-picker';
import placeholderImage from 'Assets/Images/placeholderProfile.png';
import {getUrlFromFile} from '@/State/Services/storage.service';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {Icon} from 'react-native-elements';

export const ProfileImageForm = ({mode, initialValues = {}, onFormSubmit}) => {
  const [loading, setLoading] = useState(false);
  const [profile_image_url, setFileuri] = useState(
    initialValues.profile_image_url || '',
  );

  const formRef = useRef();

  useEffect(() => {
    setFileuri(initialValues.profile_image_url || '');
  }, [initialValues]);

  // Run this on form submit
  const addInfo = (data) => {
    onFormSubmit({
      ...data,
      profile_image_url,
    });
    setLoading(false);
  };

  const chooseImage = () => {
    const options = {
      title: 'Profile Picture',
      mediaType: 'photo',
      includeBase64: true,
    };
    launchImageLibrary(options, (response) => {
      // Upload this to firebase storage
      const base64 = `data:${response.type};base64,${response.data}`;

      if (response.didCancel) {
        setLoading(false);
      } else if (response.error) {
        setLoading(false);
      } else if (response.customButton) {
      } else {
        (async () => {
          try {
            setLoading(true);
            const [fileType] = (response.type || 'image/jpeg')
              .split('/')
              .reverse();
            const fileName = `${new Date().getTime()}-${
              response.fileName || `${Math.random()}`
            }.${fileType}`;
            const url = await getUrlFromFile(response.uri, fileName);
            setFileuri(url);
            if (formRef.current) {
              formRef.current.handleSubmit();
            }
          } catch (err) {}
        })();
        setFileuri(base64);
      }
    });
  };

  return (
    <Formik
      initialValues={{
        profile_image_url,
      }}
      onSubmit={addInfo}
      validateOnBlur={false}
      innerRef={formRef}>
      {(props) => (
        <View style={styles.pageContainer}>
          <View
            style={[
              styles.imageUploadContainer,
              mode === 'full' && {overflow: 'hidden'},
            ]}>
            {!loading ? (
              <>
                <Image
                  style={
                    mode === 'full'
                      ? styles.profileImageFull
                      : styles.profileImage
                  }
                  source={
                    profile_image_url
                      ? {uri: profile_image_url}
                      : placeholderImage
                  }
                />
                {mode === 'full' ? (
                  <TouchableOpacity
                    style={styles.addPictureIconContainerFull}
                    onPress={chooseImage}>
                    <Icon
                      type="ionicon"
                      size={40}
                      color={COLORS.white}
                      name="ios-camera-outline"
                      style={styles.addPictureIconFull}
                    />
                    <Text style={styles.uploadText}>Upload</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.addPictureIconContainer}
                    onPress={chooseImage}>
                    <Icon
                      type="ionicon"
                      color={COLORS.white}
                      size={21}
                      name="pencil"
                      style={styles.addPictureIcon}
                    />
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <>
                {mode === 'full' ? (
                  <View style={styles.profileImageFull}>
                    <ActivityIndicator size={30} color={COLORS.secondary} />
                  </View>
                ) : (
                  <View style={styles.profileImage}>
                    <ActivityIndicator size={30} color={COLORS.white} />
                  </View>
                )}
              </>
            )}
          </View>
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
  imageUploadContainer: {
    ...Containers.flexCenter,
    marginBottom: 10,
    position: 'relative',
    borderRadius: 100,
  },
  profileImage: {
    height: 140,
    width: 140,
    borderRadius: 100,
    alignContent: 'center',
    justifyContent: 'center',
  },
  profileImageFull: {
    height: wp(40),
    width: wp(40),
    borderRadius: 1000,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.lightGray,
  },
  addPictureIconContainer: {
    height: 35,
    width: 35,
    backgroundColor: COLORS.blue,
    borderRadius: 50,
    position: 'absolute',
    left: 100,
    top: 5,
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
