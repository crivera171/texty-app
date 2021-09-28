import {Audio} from 'expo-av';

export const TEXTY_RECORDING_OPTIONS = {
  android: {
    extension: '.mp4',
    outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
    audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
  },
  ios: {
    extension: '.m4a',
    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_LOW,
    outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
};

export const playbackData = {
  stalling: {
    icon: 'circle',
    helper: 'Record',
  },
  playing: {
    icon: 'pause',
    helper: 'Pause',
  },
  paused: {
    icon: 'play',
    helper: 'Preview',
  },
  recording: {
    icon: 'stop',
    helper: 'Stop',
  },
};
