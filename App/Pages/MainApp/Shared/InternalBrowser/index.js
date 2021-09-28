import tw from 'tw';
import {Containers} from 'Styles';
import {COLORS} from 'Styles/colors';
import {WebView} from 'react-native-webview';
import React, {useRef, useState} from 'react';
import {Header} from '@/Components/Layout/Header';
import {View, Platform, ActivityIndicator, StyleSheet} from 'react-native';
import {AlertBox} from '@/Components/AlertBox';

/**
 * Screen used to display external urls inside the app
 * Route params required:
 *  - uri: destination
 *  - successUrl: when specific url is opened inside webview, webview closes ex. redirect stripe url
 *  - failureUrl
 *  - successModalMsg
 *  - failureModalMsg
 *
 * @param navigation
 * @param route
 * @returns {JSX.Element}
 * @constructor
 */
const InternalBrowser = ({navigation, route}) => {
  /**
   * Close internal browser
   */
  const close = () => {
    navigation.goBack();
  };

  /**
   * Go back if uri is not provided in route params
   */
  const {
    uri,
    successUrl,
    successModalMsg,
    failureUrl,
    failureModalMsg,
  } = route.params;
  if (!uri) {
    close();
  }

  /**
   * WebView ref
   *
   * @type {React.MutableRefObject<null>}
   */
  const webViewRef = useRef(null);

  /**
   * Whether to hide back button
   */
  const [hideBack, setHideBack] = useState(false);

  /**
   * Whether to show success modal
   */
  const [showModal, setShowModal] = useState(false);

  /**
   * Modal message
   */
  const [modalMsg, setModalMsg] = useState('Done');

  /**
   * Go back inside webview
   */
  const goBack = () => {
    webViewRef.current.goBack();
  };

  /**
   * On navigation state change
   */
  const onNavigationStateChange = (navigationState) => {
    const {url, canGoBack} = navigationState;

    // Whether back button can do something, if no hide it
    setHideBack(!canGoBack);

    // If navigation url matches successUrl, show success
    switch (url) {
      case successUrl:
        setModalMsg(successModalMsg);
        setShowModal(true);
        break;
      case failureUrl:
        setModalMsg(failureModalMsg);
        setShowModal(true);
        break;
    }
  };

  return (
    <>
      <View style={tw('h-full')}>
        <Header
          hideBack={hideBack}
          handleBack={goBack}
          handleDone={close}
          doneTitle="Close"
          alwaysEnableBackButton
        />
        <AlertBox
          visible={showModal}
          onDismiss={close}
          onSubmit={close}
          type="success"
          title="Success"
          buttonText={'Continue'}
          text={modalMsg ?? ''}
        />
        <WebView
          source={{uri}}
          bounces={false}
          incognito={true}
          ref={webViewRef}
          startInLoadingState={true}
          sharedCookiesEnabled={false}
          onNavigationStateChange={onNavigationStateChange}
          scalesPageToFit={Platform.select({ios: false, android: true})}
          renderLoading={() => (
            <View style={[tw('h-full'), styles.loaderContainer]}>
              <ActivityIndicator size="small" color={COLORS.blue} />
            </View>
          )}
          userAgent="Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko"
        />
      </View>
    </>
  );
};

export default InternalBrowser;

const styles = StyleSheet.create({
  loaderContainer: {
    ...Containers.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
