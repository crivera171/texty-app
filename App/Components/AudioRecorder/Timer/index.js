import React, {useEffect} from 'react';
import {View, Text} from 'react-native';

export const Timer = ({isCounting, onTimeLimitExceeded, textStyle, suffix}) => {
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
    <View>
      <Text style={textStyle}>
        {formatTimer()}
        {suffix ? ' / ' + suffix : null}
      </Text>
    </View>
  );
};
