import {useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';

export const usePoll = (callback, intervalDuration, deps = []) => {
  useFocusEffect(
    useCallback(() => {
      callback();
      const interval = setInterval(callback, intervalDuration);
      return () => clearInterval(interval);
    }, deps),
  );
};
