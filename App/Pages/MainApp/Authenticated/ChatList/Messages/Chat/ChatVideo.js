import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  ImageBackground,
} from 'react-native';
import {Video} from 'expo-av';
import {Icon} from 'react-native-elements';
import {COLORS} from 'Styles/colors.js';
import {ActivityIndicator} from 'react-native';
import tw from 'tw';

export const ChatVideo = (props) => {
  const [video, setVideo] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVideoRef = async (component) => {
    setVideo(component);
  };

  const toggleVideoPlayback = () => {
    video.loadAsync(
      {uri: props.currentMessage.video},
      {shouldPlay: true, volume: 1},
    );
  };

  const onLoadStart = () => {
    setLoading(true);
  };

  const onLoad = () => {
    setLoading(false);
    video.presentFullscreenPlayer();
  };

  return (
    <>
      {props.currentMessage.video ? (
        <View style={styles.videoContainer}>
          <ImageBackground style={styles.controlsWrapper}>
            <TouchableWithoutFeedback onPress={toggleVideoPlayback}>
              <View style={styles.video}>
                <View style={styles.action}>
                  {loading ? (
                    <ActivityIndicator color={COLORS.blue} />
                  ) : (
                    <Icon
                      type="ionicon"
                      name={'play'}
                      size={25}
                      color={COLORS.blue}
                    />
                  )}
                </View>
                <Video
                  resizeMode={Video.RESIZE_MODE_COVER}
                  onLoadStart={onLoadStart}
                  onLoad={onLoad}
                  onPlaybackStatusUpdate={(playbackStatus) => {
                    if (playbackStatus.didJustFinish) {
                      video.dismissFullscreenPlayer();
                      video.unloadAsync();
                    }
                  }}
                  onFullscreenUpdate={(fullscreenStatus) => {
                    if (fullscreenStatus.fullscreenUpdate === 3) {
                      video.pauseAsync();
                      video.unloadAsync();
                    }
                  }}
                  ref={handleVideoRef}
                />
              </View>
            </TouchableWithoutFeedback>
          </ImageBackground>
        </View>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  action: {
    ...tw('justify-center items-center h-full'),
    backgroundColor: COLORS.lightGray,
    width: '100%',
    height: '100%',
  },
  videoContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
    backgroundColor: COLORS.lightGray,
  },
  controlsWrapper: {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});
