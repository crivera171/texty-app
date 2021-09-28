import React, {useState, useRef, useEffect} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {COLORS} from 'Styles/colors.js';
import {Containers} from 'Styles';
import SemiCircleProgress from '@/Components/Shared/Data/Progress';

const styles = StyleSheet.create({
  audioChatTimerWrapper: {
    textAlign: 'center',
    position: 'absolute',
    top: 60,
  },
  audioChatTimerText: {
    marginRight: 25,
    fontSize: 16,
    color: COLORS.darkGray,
  },
  progressWrapper: {
    elevation: 0,
    width: 90,
    position: 'absolute',
    left: 35,
    top: 30,
    overflow: 'hidden',
  },
});

export const Timer = ({isCounting, showText, onTimeLimitExceeded}) => {
  const [recordTime, setRecordTime] = React.useState(0);
  const interval = React.useRef();

  const formatTimer = () => {
    const d = Number(recordTime);
    const m = Math.floor((d % 3600) / 60);
    const s = Math.floor((d % 3600) % 60);
    if (s < 10) {
      return `${m}:0${s}`;
    }

    return `${m}:${s}`;
  };

  useEffect(() => {
    if (recordTime >= 240) {
      onTimeLimitExceeded();
    }
  }, [recordTime]);

  const incrementTimer = () => {
    setRecordTime((timer) => timer + 1);
  };

  useEffect(() => {
    if (isCounting) {
      interval.current = setInterval(incrementTimer, 1000);

      return () => clearInterval(interval.current);
    } else {
      clearInterval(interval.current);
    }
  }, [isCounting]);

  return (
    <>
      <View style={styles.progressWrapper}>
        <SemiCircleProgress
          percentage={recordTime / 5}
          exteriorCircleStyle={{backgroundColor: COLORS.blue}}
          progressColor={COLORS.secondary}
        />
      </View>
      <View style={styles.audioChatTimerWrapper}>
        {showText && (
          <Text style={styles.audioChatTimerText}>{formatTimer()}</Text>
        )}
      </View>
    </>
  );
};
