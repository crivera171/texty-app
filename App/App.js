import React from 'react';
import {AuthProvider} from 'State/AuthContext';
import {ProfileProvider} from 'State/ProfileContext';
import {OnboardingProvider} from 'State/OnboardingContext';
import {MessageProvider} from 'State/MessageContext';
import {ContactProvider} from 'State/ContactContext';
import {DashboardProvider} from 'State/DashboardContext';
import {NavProvider} from 'State/NavContext';
import {ItemProvider} from 'State/ItemContext';
import {TimeslotProvider} from 'State/TimeslotContext';
import {SocialMediaProvider} from 'State/SocialMediaContext';
import Routes from './Routes.js';
import './checkActions';
import {
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {COLORS} from 'Styles/colors.js';
import {RecoilRoot} from 'recoil';
import tw from 'tw';

const App = () => {
  LogBox.ignoreLogs = ['Calling getNode()']
  return (
    <RecoilRoot>
      <DashboardProvider>
        <ContactProvider>
          <MessageProvider>
            <OnboardingProvider>
              <ProfileProvider>
                <ItemProvider>
                  <NavProvider>
                    <TimeslotProvider>
                      <SocialMediaProvider>
                        <AuthProvider>
                          <StatusBar
                            translucent
                            backgroundColor={COLORS.white}
                            barStyle="dark-content"
                          />

                          <KeyboardAvoidingView
                            behavior={
                              Platform.OS === 'ios' ? 'padding' : 'height'
                            }
                            style={tw('flex-1')}>
                            <TouchableWithoutFeedback
                              onPress={Keyboard.dismiss}>
                              <Routes />
                            </TouchableWithoutFeedback>
                          </KeyboardAvoidingView>
                        </AuthProvider>
                      </SocialMediaProvider>
                    </TimeslotProvider>
                  </NavProvider>
                </ItemProvider>
              </ProfileProvider>
            </OnboardingProvider>
          </MessageProvider>
        </ContactProvider>
      </DashboardProvider>
    </RecoilRoot>
  );
};

export default App;
