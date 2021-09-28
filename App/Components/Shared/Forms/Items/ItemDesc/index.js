/* eslint-disable max-lines */
import React, {useState, useEffect, useContext, useMemo} from 'react';
import {
  View,
  Text,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {Formik} from 'formik';
import {Inputs, Containers, Typography, Buttons} from '@/Styles';
import * as Yup from 'yup';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {ButtonGroup} from '@/Components/Buttons/ButtonGroup';
import {Input} from '@/Components/Inputs/Input';
import tw from 'tw';
import {ItemStore} from 'State/ItemContext';
import DocumentPicker from 'react-native-document-picker';
import {COLORS} from '@/Styles/colors';
import {Menu} from '@/Components/Menu';
import {request, PERMISSIONS} from 'react-native-permissions';
import RNFS from 'react-native-fs';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import * as FileSystem from 'expo-file-system';
import * as mime from 'react-native-mime-types';

const ItemsSchema = Yup.object().shape({
  description: Yup.string()
    .max(750, 'Description is too long (750 characters max)')
    .required('This field is required'),
  call_url: Yup.string().when(['type', 'call_type'], {
    is: (type, call_type) => type === 'call' && call_type === 'web',
    then: Yup.string().required('Enter meeting URL'),
  }),
});

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

export const ItemDesc = ({initialValues, onBack, onSubmit, last}) => {
  const {itemState, itemActions} = useContext(ItemStore);
  const [menu, setMenu] = useState(false);
  const [description, setDescription] = useState(
    initialValues.description || '',
  );
  const [validatingRealTime, setValidatingRealTime] = useState(false);
  const [publishable, setPublishable] = useState(false);
  const [callUrl, setCallUrl] = useState(initialValues.call_url || '');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploaded, setIsUploaded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  useEffect(() => {
    if (initialValues.name && initialValues.type) {
      setPublishable(true);
    }
  }, [initialValues]);

  const handleResponse = (response) => {
    setIsUploaded(false);
    setPublishable(false);
    if (response.didCancel) {
      setMenu(false);
      setIsUploaded(false);
      setPublishable(true);
    } else if (response.error) {
      setMenu(false);
      setIsUploaded(false);
      setPublishable(true);
    } else if (response.customButton) {
      setMenu(false);
      setIsUploaded(false);
      setPublishable(true);
    } else {
      setMenu(false);
      (async () => {
        try {
          setIsUploaded(false);
          let path = response.uri;
          if (Platform.OS === 'android') {
            path = await getRealPath(response.uri);
          }
          const {size} = await FileSystem.getInfoAsync(path, {
            size: true,
          });

          if (isValid({size})) {
            setSelectedFiles([
              ...selectedFiles,
              {
                path,
                name: response.fileName,
                type: mime.lookup(path),
              },
            ]);

            const data = new FormData();
            data.append('influencer_item_id', initialValues.editing_id);
            data.append('files', {
              uri: path,
              type: mime.lookup(path),
              name: response.fileName,
            });

            await itemActions.uploadFiles(data);
            await itemActions.getFiles();
          }

          setSelectedFiles([]);
          setIsUploaded(true);
          setPublishable(true);
        } catch (err) {
          setSelectedFiles([]);
          Alert.alert('Could not upload video');
          setIsUploaded(false);
          setPublishable(true);
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
      launchCamera(
        {
          title: 'Record a video',
          mediaType: 'video',
          durationLimit: 240,
          cameraType: 'front',
        },
        (response) => {
          handleResponse(response);
        },
      );
    }
  };

  const chooseImage = () => {
    launchImageLibrary(
      {
        title: 'Photo or video',
        mediaType: 'mixed',
      },
      (response) => {
        handleResponse(response);
      },
    );
  };

  const uploadFiles = async () => {
    setMenu(false);
    try {
      setPublishable(false);
      setIsUploaded(false);
      const response = await DocumentPicker.pickMultiple({
        type: [
          DocumentPicker.types.images,
          DocumentPicker.types.pdf,
          DocumentPicker.types.docx,
          DocumentPicker.types.doc,
        ],
      });
      const data = new FormData();

      setSelectedFiles([...selectedFiles, ...response]);
      data.append('influencer_item_id', initialValues.editing_id);

      for (const file in response) {
        if (isValid(response[file])) {
          const {uri, type, name} = response[file];
          data.append('files', {uri, type, name});
        }
      }

      await itemActions.uploadFiles(data);
      await itemActions.getFiles();

      setSelectedFiles([]);
      setIsUploaded(true);
      setPublishable(true);
    } catch (err) {
      setSelectedFiles([]);
      setIsUploaded(false);
      setPublishable(true);
    }
  };

  const getFiles = useMemo(() => {
    const filesArr = [];
    if (itemState.files && itemState.files.length) {
      const files = itemState.files.filter(
        (file) => file.owner_id === initialValues.editing_id,
      );
      for (const f in files) {
        const file = files[f];
        filesArr.push({...file, name: file.path, size: 0});
      }
    }

    return filesArr;
  }, [itemState.files]);

  const isValid = (file) => {
    if (file.size > 26214400) {
      return false;
    }
    return true;
  };

  const getIcon = (file) => {
    if (file.type) {
      const type = file.type.split('/')[1].toLowerCase();
      if (['doc', 'docx'].includes(type)) {
        return 'file-word';
      } else if (['jpg', 'jpeg', 'png', 'gif'].includes(type)) {
        return 'file-image';
      } else if (type === 'pdf') {
        return 'file-pdf';
      } else if (type === 'mp4') {
        return 'file-video';
      } else {
        return 'file';
      }
    }

    return 'file';
  };

  const removeFile = async (fileId) => {
    setPublishable(false);
    setIsDeleting({...isDeleting, [fileId]: true});
    await itemActions.removeFile(fileId);
    await itemActions.getFiles();
    setIsDeleting({...isDeleting, [fileId]: false});
    setPublishable(true);
  };

  const contentReady = useMemo(() => {
    return (
      initialValues.type !== 'content' ||
      (getFiles.length && initialValues.type === 'content' && publishable)
    );
  }, [publishable, getFiles.length, initialValues.type]);

  return (
    <Formik
      initialValues={{
        description,
        type: initialValues.type,
        call_type: initialValues.call_type,
        call_url: callUrl,
      }}
      onSubmit={onSubmit}
      validationSchema={ItemsSchema}
      validateOnBlur={false}
      validateOnChange={validatingRealTime}>
      {(props) => (
        <View style={styles.pageContainer}>
          <Menu
            isVisible={menu}
            onDismiss={() => setMenu(false)}
            title="Attach a file"
            actions={[
              {
                icon: 'photo-library',
                name: 'Photo or Video',
                color: COLORS.blue,
                onActionPress: () => {
                  chooseImage();
                },
              },
              {
                icon: 'photo-camera',
                name: 'Record a video',
                color: COLORS.blue,
                onActionPress: () => {
                  takeVideo();
                },
              },
              {
                icon: 'file-upload',
                name: 'File',
                color: COLORS.blue,
                last: true,
                onActionPress: () => {
                  uploadFiles();
                },
              },
            ]}
          />
          <View style={styles.formContainer}>
            <KeyboardAvoidingView behavior={'padding'}>
              <ScrollView
                contentContainerStyle={[
                  Containers.container,
                  tw('border-b-0 pt-4'),
                ]}>
                {initialValues.type === 'link' ? (
                  <View>
                    <View style={styles.inputContainer}>
                      <Input
                        onChangeText={(descText) => {
                          props.handleChange('description')(descText);
                          setDescription(descText);
                        }}
                        defaultValue={description}
                        value={description}
                        label={'Link URL'}
                        labelStyle={styles.screenTitle}
                        error={props.errors.description}
                      />
                    </View>
                  </View>
                ) : (
                  <View>
                    {initialValues.type === 'call' &&
                    initialValues.call_type === 'web' ? (
                      <View style={styles.inputContainer}>
                        <Input
                          onChangeText={(urlText) => {
                            props.handleChange('call_url')(urlText);
                            setCallUrl(urlText);
                          }}
                          defaultValue={callUrl}
                          value={callUrl}
                          label={'Meeting URL'}
                          labelStyle={styles.screenTitle}
                          error={props.errors.call_url}
                        />
                        <Text style={[styles.inputNotice, tw('my-2')]}>
                          Enter the URL to your Zoom room, Google Hangout, or
                          any other web-based meeting.
                        </Text>
                      </View>
                    ) : null}

                    <View style={styles.inputContainer}>
                      <Input
                        label={
                          initialValues.type === 'subscription'
                            ? 'Tell people why they should Subscribe to you'
                            : 'Tell your Fans about your Offer'
                        }
                        multiline={true}
                        numberOfLines={8}
                        placeholder="Type..."
                        onChangeText={(descText) => {
                          props.handleChange('description')(descText);
                          setDescription(descText);
                        }}
                        name="description"
                        value={description}
                        error={props.errors.description}
                        maxCharacters={750}
                      />
                    </View>
                    <Text style={styles.inputNotice}>
                      {initialValues.type === 'subscription'
                        ? 'Briefly describe what information the fan should know about your Subscription.'
                        : 'Describe this offering for your fans. Shown under each item on your profile.'}
                    </Text>

                    {initialValues.type === 'content' ? (
                      <View style={tw('mt-3')}>
                        {selectedFiles && selectedFiles.length ? (
                          <View>
                            {selectedFiles.map((file, idx) => (
                              <View
                                key={idx}
                                style={tw(
                                  'flex-row items-center justify-between mb-4 w-full',
                                )}>
                                {isValid(file) ? (
                                  isUploaded ? (
                                    <Icon
                                      name="check-circle"
                                      type="font-awesome-5"
                                      size={wp(5)}
                                      color={COLORS.green}
                                    />
                                  ) : (
                                    <ActivityIndicator
                                      size={20}
                                      color={COLORS.blue}
                                    />
                                  )
                                ) : (
                                  <Icon
                                    name="exclamation-circle"
                                    type="font-awesome-5"
                                    size={wp(5)}
                                    color={COLORS.red}
                                  />
                                )}
                                <Icon
                                  name={getIcon(file)}
                                  type="font-awesome-5"
                                  size={wp(8)}
                                  color={COLORS.darkGray}
                                  style={tw('px-3')}
                                  solid
                                />
                                <Text
                                  numberOfLines={1}
                                  style={tw(`flex-1
                              ${
                                isValid(file)
                                  ? isUploaded
                                    ? 'text-success'
                                    : 'text-blue'
                                  : 'text-red'
                              }`)}>
                                  {file.path || file.name}
                                </Text>
                              </View>
                            ))}
                          </View>
                        ) : null}

                        {getFiles && getFiles.length ? (
                          <View>
                            {getFiles.map((file, idx) => (
                              <View
                                key={idx}
                                style={tw(
                                  'flex-row items-center justify-between mb-4 w-full',
                                )}>
                                {isDeleting[file.id] ? (
                                  <ActivityIndicator
                                    size={20}
                                    color={COLORS.blue}
                                  />
                                ) : (
                                  <TouchableOpacity
                                    onPress={() => removeFile(file.id)}>
                                    <Icon
                                      name="times-circle"
                                      type="font-awesome-5"
                                      size={wp(5)}
                                      color={COLORS.red}
                                    />
                                  </TouchableOpacity>
                                )}
                                <Icon
                                  name={getIcon(file)}
                                  type="font-awesome-5"
                                  size={wp(8)}
                                  color={COLORS.darkGray}
                                  style={tw('px-3')}
                                  solid
                                />
                                <Text
                                  numberOfLines={1}
                                  style={tw('text-blue flex-1')}>
                                  {file.path || file.name}
                                </Text>
                              </View>
                            ))}
                          </View>
                        ) : null}

                        <TouchableOpacity
                          style={tw(
                            'flex-row flex-wrap border-dotted justify-center content-between border bg-light-gray rounded border-gray py-4 mt-2',
                          )}
                          onPress={() => setMenu(true)}>
                          <Icon
                            name="cloud-upload-alt"
                            type="font-awesome-5"
                            size={wp(5)}
                            color={COLORS.blackGray}
                          />
                          <Text
                            style={[Typography.subtitle, tw('pl-2 font-bold')]}>
                            Add Files
                          </Text>
                          <View style={tw('w-full mt-2')}>
                            <Text
                              style={tw('text-center text-dark-gray w-full')}>
                              PDF | DOC | DOCX | MP4 | PNG | JPG
                            </Text>
                            <Text
                              style={tw('text-center text-dark-gray w-full')}>
                              Maximum Size - 25 MB
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    ) : null}
                  </View>
                )}
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
          <ButtonGroup
            disableNextBtn={(last && !publishable) || !contentReady}
            nextTitle={last ? 'Publish' : null}
            onBack={onBack}
            onNext={() => {
              Keyboard.dismiss();
              props.handleSubmit();
              setValidatingRealTime(true);
            }}
          />
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    height: '100%',
  },
  screenTitle: {
    ...Typography.subtitle,
  },
  styledTextarea: {
    ...Inputs.stackedTextarea,
    marginTop: hp(1),
    fontSize: wp(4),
    minHeight: hp(20),
    textAlignVertical: 'top',
  },
  formContainer: {
    ...Containers.tabPageContainer,
    ...tw('w-full flex justify-between h-full flex-1 pt-0'),
  },
  controls: {
    ...Containers.flexCenter,
    paddingBottom: hp(5),
  },
  nextButton: {
    ...Buttons.formButton,
  },
  nextButtonText: {
    ...Buttons.lightButtonText,
  },
  inputNotice: {
    ...Typography.notice,
  },
  inputContainer: {
    ...Inputs.stackedInputWrapper,
    marginTop: 0,
  },
});
