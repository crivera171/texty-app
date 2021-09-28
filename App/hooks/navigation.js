import {useCallback, useContext} from 'react';
import {NavStore} from 'State/NavContext';
import {useFocusEffect} from '@react-navigation/native';

export const useSupressedTabBar = (handler) => {
  const {navActions} = useContext(NavStore);

  useFocusEffect(
    useCallback(() => {
      navActions.minimizeTabBar();

      return () => navActions.maximizeTabBar();
    }, [navActions.minimizeTabBar, navActions.maximizeTabBar]),
  );
};
