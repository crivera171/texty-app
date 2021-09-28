import React, {useState} from 'react';
import {StyleSheet, View, TouchableWithoutFeedback, Text} from 'react-native';
import {Video} from 'expo-av';
import {Icon} from 'react-native-elements';
import {COLORS} from 'Styles/colors.js';
import {Typography} from 'Styles';
import {ActivityIndicator} from 'react-native';
import tw from 'tw';

export const ChatAudio = (props) => {
  const [audio, setAudio] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const handleAudioRef = async (component) => {
    setAudio(component);
  };

  const toggleAudioPlayback = () => {
    if (!isLoaded) {
      audio.loadAsync(
        {uri: props.currentMessage.audio},
        {shouldPlay: true, volume: 1},
      );
    }

    if (isPlaying) {
      audio.pauseAsync();
    } else {
      audio.playAsync();
    }
  };

  const onLoadStart = () => {
    setLoading(true);
  };

  const onLoad = () => {
    setLoading(false);
    setIsLoaded(true);
  };

  return (
    <>
      {props.currentMessage.audio ? (
        <TouchableWithoutFeedback onPress={toggleAudioPlayback}>
          <View style={styles.controlsWrapper}>
            <View style={styles.action}>
              {loading ? (
                <ActivityIndicator color={COLORS.blue} />
              ) : (
                <Icon
                  type="ionicon"
                  name={isPlaying ? 'pause' : 'play'}
                  size={25}
                  color={COLORS.blue}
                />
              )}
              <Text style={Typography.subtitle}>Audio Message</Text>
            </View>
            <Video
              style={styles.audio}
              onLoadStart={onLoadStart}
              onLoad={onLoad}
              onPlaybackStatusUpdate={(playbackStatus) => {
                if (playbackStatus.isPlaying) {
                  setIsPlaying(true);
                } else {
                  setIsPlaying(false);
                }
                if (playbackStatus.didJustFinish) {
                  audio.unloadAsync();
                  setIsLoaded(false);
                }
              }}
              ref={handleAudioRef}
            />
          </View>
        </TouchableWithoutFeedback>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  action: {
    ...tw('flex-row self-center justify-center content-center items-center'),
    justifyContent: 'space-between',
    width: '100%',
    height: 60,
  },
  loading: {
    ...tw('self-center justify-center content-center items-center'),
    backgroundColor: '#BDBDBD',
  },
  controlsWrapper: {
    width: 150,
    ...tw('self-center justify-center content-center items-center'),
  },
  audio: {
    height: 0,
    width: 0,
  },
});
