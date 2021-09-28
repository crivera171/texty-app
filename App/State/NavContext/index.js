import { initial } from 'lodash';
import React, {createContext, useCallback, useEffect, useReducer} from 'react';
import {
  SET_TABS_VISIBILITY,
} from './actions';

const initialState = {
  tabBarVisible: true
};

function reducer(state, action) {
  switch (action.type) {

    case SET_TABS_VISIBILITY:
      return {
        ...state,
        tabBarVisible: action.payload
      };

    default:
      return state;
  }
}

export const NavStore = createContext();

export function NavProvider(props) {
  const [navState, dispatch] = useReducer(reducer, initialState);

  const minimizeTabBar = useCallback(() => { dispatch({type: SET_TABS_VISIBILITY, payload: false})} , [dispatch])
  const maximizeTabBar = useCallback(() => { dispatch({type: SET_TABS_VISIBILITY, payload: true})} , [dispatch])

  const value = {
      navState,
      navActions: {
        minimizeTabBar,
        maximizeTabBar,
      },
      dispatch,
    };
    return (
      <NavStore.Provider value={value}>{props.children}</NavStore.Provider>
    );
}
