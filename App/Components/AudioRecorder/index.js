/* eslint-disable max-lines */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useMemo} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Modal,
  StatusBar,
  SafeAreaView,
  Alert,
} from 'react-native';
import {COLORS} from 'Styles/colors.js';
import {Audio} from 'expo-av';
import {Icon} from 'react-native-elements';
import tw from 'tw';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Timer} from './Timer';
import {TEXTY_RECORDING_OPTIONS, playbackData} from './constants';
import RNSoundLevel from 'react-native-sound-level';
import MediaMeta from 'react-native-media-meta';
import * as FileSystem from 'expo-file-system';

const AudioRecorder = ({onRecordingStart, onDismiss, onSend}) => {
  const [hasPermission, setHasPermission] = useState(false);

  const [recording, setRecording] = useState(false);

  const [playbackStatus, setPlaybackStatus] = useState('stalling');

  const [isCounting, setIsCounting] = useState(false);

  const [soundUri, setSoundUri] = useState();
  const [source, setSource] = useState();

  const [db, setDb] = useState(false);
  const [dbValues, setDbValues] = useState([]);

  useEffect(() => {
    if (hasPermission) {
      RNSoundLevel.start();
      RNSoundLevel.onNewFrame = (data) => {
        if (playbackStatus === 'recording') {
          setDb(data.value + 160);
        }
      };
      return () => RNSoundLevel.stop();
    }
  }, [hasPermission, playbackStatus]);

  useEffect(() => {
    if (db) {
      setDbValues([...dbValues, db]);
    }
  }, [db]);

  const waveform = useMemo(() => {
    return (
      <View style={tw('flex-row w-full items-center justify-end')}>
        {dbValues.map((val, idx) => (
          <View
            key={idx}
            style={{
              width: 3,
              height: val === 0 ? 5 : val,
              ...tw('bg-white mr-2'),
            }}
          />
        ))}
      </View>
    );
  }, [dbValues]);

  useEffect(() => {
    return source
      ? () => {
          source.unloadAsync();
        }
      : undefined;
  }, [source]);

  useEffect(() => {
    (async () => {
      const {status} = await Audio.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const startAudioRecord = async () => {
    try {
      onRecordingStart();
      setPlaybackStatus('recording');
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(TEXTY_RECORDING_OPTIONS);
      await newRecording.startAsync();
      setRecording(newRecording);
      setIsCounting(true);
    } catch (err) {
      Alert.alert("Couldn't start audio recording");
    }
  };

  const stopAudioRecord = async () => {
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    const {duration} = await MediaMeta.get(uri.replace('file://', ''));
    const {size} = await FileSystem.getInfoAsync(uri, {size: true});

    setSoundUri({path: uri, duration, size});
    setIsCounting(false);
    setPlaybackStatus('paused');
    setRecording(undefined);
  };

  const playAudioRecord = async () => {
    if (playbackStatus === 'playing') {
      pausePlayingAudio();
      setPlaybackStatus('paused');
      return;
    }

    const {sound} = await Audio.Sound.createAsync(
      {uri: soundUri.path},
      {},
      (status) => {
        if (status.didJustFinish) {
          setPlaybackStatus('paused');
        }
      },
    );

    setSource(sound);
    setPlaybackStatus('playing');
    await sound.playAsync();
  };

  const pausePlayingAudio = async () => {
    await source.pauseAsync();
    setPlaybackStatus('paused');
  };

  return (
    <Modal visible animationType="fade" transparent={true}>
      <StatusBar backgroundColor="rgba(0,0,0,0.8)" />
      <SafeAreaView style={{backgroundColor: 'rgba(0,0,0,0.8)'}}>
        <View style={styles.modalWrapper}>
          <View style={tw('flex-row items-center px-4')}>
            <TouchableOpacity onPress={onDismiss} style={styles.controls}>
              <Icon
                color={COLORS.white}
                name="chevron-left"
                type="font-awesome-5"
              />
              <Text style={tw('text-white pl-2')}>Cancel</Text>
            </TouchableOpacity>
            <View style={tw('flex-1')}>
              <Timer
                suffix="4:00"
                isCounting={isCounting}
                onTimeLimitExceeded={() => stopAudioRecord()}
                textStyle={tw('text-white text-center')}
              />
            </View>
            <View style={styles.controls} />
          </View>
          {waveform}
          <View style={styles.playback}>
            {soundUri ? <View style={tw('flex-1')} /> : null}
            {hasPermission ? (
              <TouchableOpacity
                style={tw('flex-col justify-center items-center flex-1')}
                onPress={() => {
                  if (playbackStatus === 'stalling') {
                    startAudioRecord();
                  }
                  if (playbackStatus === 'recording') {
                    stopAudioRecord();
                  }
                  if (playbackStatus === 'paused') {
                    playAudioRecord();
                  }
                  if (playbackStatus === 'playing') {
                    pausePlayingAudio();
                  }
                }}>
                <View style={styles.playbackBtnWrapper}>
                  <Icon
                    color={COLORS.red}
                    name={playbackData[playbackStatus].icon}
                    type="font-awesome-5"
                    size={wp(6)}
                    solid
                  />
                </View>
                <View style={styles.playbackHelperWrapper}>
                  <Text style={tw('text-white text-center')}>
                    {playbackData[playbackStatus].helper}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : null}
            {soundUri ? (
              <TouchableOpacity
                onPress={() => onSend(soundUri)}
                style={tw('flex-col justify-center items-center flex-1')}>
                <View style={styles.playbackBtnWrapper}>
                  <Icon
                    color={COLORS.white}
                    name={'check'}
                    type="font-awesome-5"
                    size={wp(6)}
                    solid
                  />
                </View>
                <View style={styles.playbackHelperWrapper}>
                  <Text style={tw('text-white text-center')}>Done</Text>
                </View>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  controls: {
    width: wp(20),
    ...tw('flex-row items-center'),
  },
  modalWrapper: {
    ...tw('w-full h-full flex-col justify-between'),
  },
  playback: {
    ...tw('flex-row justify-center items-center px-4 w-full'),
    minHeight: hp(20),
  },
  playbackBtnWrapper: {
    ...tw('flex-row justify-center items-center'),
    borderWidth: 2,
    borderRadius: wp(10),
    borderColor: COLORS.white,
    width: wp(14),
    height: wp(14),
  },
  playbackHelperWrapper: {
    ...tw('mt-2 px-4'),
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 4,
  },
});

export default AudioRecorder;
