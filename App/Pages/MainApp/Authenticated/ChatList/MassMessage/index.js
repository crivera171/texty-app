/* eslint-disable max-lines */
import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from 'react';
import {View, Text, Alert, TouchableOpacity, Platform} from 'react-native';
import {Picker} from '@/Components/Inputs/Picker';
import {Formik} from 'formik';
import * as Yup from 'yup';
import tw from 'tw';
import {Input} from 'Components/Inputs/Input';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Containers, Typography} from '@/Styles';
import {ItemStore} from 'State/ItemContext';
import {COLORS} from 'Styles/colors.js';
import {Icon, Button} from 'react-native-elements';
import {MessageStore} from 'State/MessageContext';
import {useNavigation} from '@react-navigation/native';
import {launchCamera} from 'react-native-image-picker';
import {request, PERMISSIONS} from 'react-native-permissions';
import {handleMediaURI} from '@/utils/file';
import AudioRecorder from '@/Components/AudioRecorder';
import {Modal} from '@/Components/Modal';

const options = {
  title: 'Profile Intro',
  mediaType: 'video',
  durationLimit: 240,
  cameraType: 'front',
};

const ItemIcons = {
  subscription: 'vote-yea',
  call: 'user-friends',
  response: 'comment',
  link: 'link',
  content: 'file-invoice',
};

const MMSchema = Yup.object().shape({
  to: Yup.string().required('This field is required'),
  message: Yup.string()
    .max(1600, 'Message is too long')
    .required('This field is required'),
});

const values = [
  {
    label: 'Everyone',
    value: 'everyone',
  },
  {
    label: 'Fans',
    value: 'fans',
  },
  {
    label: 'Customers',
    value: 'customers',
  },
  {
    label: 'Subscribers',
    value: 'subscribers',
  },
];

const MassMessage = () => {
  const {itemState} = useContext(ItemStore);
  const {actions} = useContext(MessageStore);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [file, setFile] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const navigation = useNavigation();
  const formRef = useRef(null);
  const [audioRecorder, setAudioRecorder] = useState(false);
  const [mode, setMode] = useState('');

  const takeVideo = async () => {
    setMode('video');
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
        } else if (response.customButton) {
        } else {
          setLoading(true);
          try {
            const fileInfo = await handleMediaURI(response);
            setFile(fileInfo);
          } catch {
            setLoading(false);
          }
          setLoading(false);
        }
      });
    }
  };

  const showAlert = () =>
    Alert.alert(
      'Not enough credits',
      "You don't have enough credits to send your message. Pelase buy more credits.",
      [
        {
          text: 'Buy more credits',
          onPress: () => navigation.navigate('purchaseCreditsPage'),
          style: 'default',
        },
        {
          cancelable: true,
          text: 'Cancel',
          style: 'default',
        },
      ],
    );

  const sendMsg = useCallback(
    ({to, message, item, media_id}) =>
      actions
        .sendMassMessage({
          to,
          message,
          item,
          media_id,
        })
        .then(() => {
          formRef.current.resetForm();
          setItemId(false);
          setMessage('');
          setLoading(false);
          setFile(false);
          setIsSent(true);
        })
        .catch(() => {
          showAlert();
        })[actions.sendMassMessage],
  );

  const handleMsg = useCallback(
    async ({to, message, item}) => {
      setLoading(true);
      if (file) {
        const handler = {
          audio: actions.sendAudioMessage,
          video: actions.sendVideoMessage,
        }[mode];

        const file_info = await handler({
          file_uri: file.path,
          size: file.size,
          duration: file.duration,
        });

        try {
          await actions.finishMediaMessage(file_info, 0, true);
        } catch {
          Alert.alert('Could not send the media message. Please try again.');
        }

        await sendMsg({to, message, item, media_id: file_info.id});
      } else {
        await sendMsg({to, message, item});
      }
    },
    [
      actions.sendAudioMessage,
      actions.sendVideoMessage,
      actions.finishMediaUpload,
      actions.sendMassMessage,
      file,
    ],
  );

  const [to, setTo] = useState('everyone');
  const [message, setMessage] = useState('');
  const [itemId, setItemId] = useState(false);
  const [itemValues, setItemValues] = useState([]);

  useEffect(() => {
    if (itemState.items && itemState.items.length) {
      const prepareData = [];
      for (const item of itemState.items) {
        if (item.product_type !== 'subscription') {
          prepareData.push({
            value: item.id,
            label: (
              <Text style={tw('flex flex-row w-full items-center pt-8')}>
                <Icon
                  color={COLORS.blue}
                  size={15}
                  type="font-awesome-5"
                  name={ItemIcons[item.product_type]}
                  style={tw('mr-4')}
                  solid
                />
                <Text style={Typography.title}>{item.name}</Text>
              </Text>
            ),
          });
        }
      }
      setItemValues(prepareData);
    }
  }, [itemState]);

  return (
    <Formik
      initialValues={{
        to,
        message,
        item: itemId,
      }}
      onSubmit={handleMsg}
      validateOnBlur={false}
      validationSchema={MMSchema}
      innerRef={formRef}>
      {(props) => (
        <View style={Containers.background}>
          <KeyboardAwareScrollView>
            {audioRecorder ? (
              <AudioRecorder
                onRecordingStart={() => setMode('audio')}
                onDismiss={() => setAudioRecorder(false)}
                onSend={(val) => {
                  setFile(val);
                  setAudioRecorder(false);
                }}
              />
            ) : null}

            {modal ? (
              <Modal
                title="Send Message"
                isVisible
                onDismiss={() => {
                  setModal(false);
                  setIsSent(false);
                }}>
                <View style={Containers.section}>
                  <View style={[Containers.container, tw('border-0')]}>
                    {isSent ? (
                      <View style={tw('py-4')}>
                        <Icon
                          color={COLORS.blue}
                          name="check-circle"
                          type="font-awesome-5"
                          size={24}
                          solid
                        />
                        <Text
                          style={[Typography.title, tw('text-center mt-2')]}>
                          Message Sent
                        </Text>
                      </View>
                    ) : (
                      <View style={tw('py-2')}>
                        <View>
                          <Text style={[Typography.title, tw('mb-1')]}>To</Text>
                          <Text style={Typography.subtitle}>
                            {values.find((x) => x.value === to).label}
                          </Text>
                        </View>
                        <View style={tw('mt-3')}>
                          <Text style={[Typography.title, tw('mb-1')]}>
                            Message
                          </Text>
                          <Text numberOfLines={5} style={Typography.subtitle}>
                            {message}
                          </Text>
                        </View>

                        <View style={tw('flex-row justify-evenly')}>
                          {itemId ? (
                            <View style={tw('flex-row items-center my-4')}>
                              <Icon
                                color={COLORS.blue}
                                name="dollar-sign"
                                type="font-awesome-5"
                                size={18}
                              />
                              <Text
                                style={[
                                  Typography.subtitle,
                                  tw('capitalize text-blue px-2'),
                                ]}>
                                Attached item
                              </Text>
                            </View>
                          ) : null}

                          {file ? (
                            <View style={tw('flex-row items-center my-4')}>
                              <Icon
                                color={COLORS.blue}
                                name="paperclip"
                                type="font-awesome-5"
                                size={18}
                              />
                              <Text
                                style={[
                                  Typography.subtitle,
                                  tw('capitalize text-blue px-2'),
                                ]}>
                                Attached {mode}
                              </Text>
                            </View>
                          ) : null}
                        </View>

                        <Button
                          icon={{
                            name: 'send',
                            type: 'font-awesome',
                            size: 18,
                            color: COLORS.white,
                          }}
                          iconRight
                          buttonStyle={tw('rounded-full p-4 bg-blue')}
                          titleStyle={[Typography.subtitle, tw('text-white')]}
                          title="Send message"
                          containerStyle={tw('mt-4')}
                          loading={loading}
                          disabled={loading}
                          onPress={() => {
                            props.handleSubmit();
                          }}
                        />
                      </View>
                    )}
                  </View>
                </View>
              </Modal>
            ) : null}

            <View style={[Containers.container, tw('border-b-0')]}>
              <Picker
                hideLabel
                values={values}
                onChangeItem={(value) => {
                  props.setFieldValue('to', value);
                  setTo(value);
                }}
                placeholder="Select recipient"
                defaultValue={to}
                label="To"
                prefix="To: "
                error={props.errors.to}
              />

              <Picker
                hideLabel
                values={[{label: 'None', value: false}, ...itemValues]}
                onChangeItem={(value) => {
                  props.setFieldValue('item', value);
                  setItemId(value);
                }}
                placeholder="Select item (optional)"
                defaultValue={false}
                error={props.errors.item_id}
                label="Item"
                inputStyle={tw('mt-0')}
              />

              <Input
                multiline
                numberOfLines={5}
                placeholder="Message"
                value={message}
                onChangeText={(text) => {
                  props.handleChange('message')(text);
                  setMessage(text);
                }}
                itemContainerStyle={tw('mt-0')}
                error={props.errors.message}
                renderRight={
                  <Text style={tw('text-blue absolute bottom-0 right-0 p-1')}>
                    {message.length}/1600
                  </Text>
                }
              />
              <View style={tw('mt-4 flex-row justify-between items-center')}>
                {file ? (
                  <View style={tw('flex-row items-center')}>
                    <Icon
                      color={COLORS.blue}
                      name="paperclip"
                      type="font-awesome-5"
                      size={14}
                    />
                    <Text style={tw('capitalize text-blue px-2')}>
                      Attached {mode}
                    </Text>
                    <TouchableOpacity onPress={() => setFile(false)}>
                      <Icon
                        color={COLORS.red}
                        name="times"
                        type="font-awesome-5"
                        size={18}
                      />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={tw('flex-row')}>
                    <TouchableOpacity
                      onPress={() => setAudioRecorder(true)}
                      style={tw('p-2')}>
                      <Icon
                        color={COLORS.blue}
                        name="microphone"
                        type="font-awesome-5"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={takeVideo} style={tw('p-2')}>
                      <Icon
                        color={COLORS.blue}
                        name="video"
                        type="font-awesome-5"
                      />
                    </TouchableOpacity>
                  </View>
                )}
                <Button
                  icon={{
                    name: 'send',
                    type: 'font-awesome',
                    size: 18,
                    color: COLORS.white,
                  }}
                  iconRight
                  buttonStyle={tw('rounded-full p-4 bg-blue')}
                  title="Send"
                  onPress={() => {
                    props.validateForm().then((val) => {
                      if (Object.keys(val).length === 0) {
                        setModal(true);
                      }
                    });
                  }}
                />
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>
      )}
    </Formik>
  );
};

export default MassMessage;
