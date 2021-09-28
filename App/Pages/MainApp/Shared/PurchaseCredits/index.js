import React, {useRef, useState, useEffect} from 'react';
import {WebView} from 'react-native-webview';
import {View, Platform} from 'react-native';
import {Header} from '@/Components/Layout/Header';
import tw from 'tw';
import {APP_URL} from '@/State/Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CookieManager from '@react-native-cookies/cookies';

const PurchaseCreditsPage = ({navigation}) => {
  const webViewRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const close = () => {
    navigation.goBack();
  };

  const goBack = () => {
    webViewRef.current.goBack();
  };

  /**
   * Handle events (messages) from page loaded in webview
   */
  const onWebViewMessage = (e) => {
    const {nativeEvent} = e;
    const payload = JSON.parse(nativeEvent.data ?? '');

    const {event} = payload;
    switch (event) {
      case 'close_webview':
        close();
        break;
      case 'purchase_complete':
        close();
        break;
      default:
        break;
    }
  };

  const scalesPageToFit = Platform.OS === 'android';

  useEffect(() => {
    AsyncStorage.getItem('AUTH_TOKEN').then((token) => {
      CookieManager.set(APP_URL, {
        name: '_txtok',
        value: token,
      });
      setLoading(false);
    });
  }, []);

  return (
    <>
      {!loading ? (
        <View style={tw('h-full')}>
          <Header
            handleBack={goBack}
            handleDone={close}
            doneTitle="Close"
            title="Manage Credits"
          />
          <WebView
            ref={webViewRef}
            source={{
              uri: `${APP_URL}/creator/dashboard`,
            }}
            onMessage={onWebViewMessage}
            sharedCookiesEnabled={true}
            bounces={false}
            scalesPageToFit={scalesPageToFit}
          />
        </View>
      ) : null}
    </>
  );
};

export default PurchaseCreditsPage;
