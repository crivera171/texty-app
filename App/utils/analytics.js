import analytics from '@react-native-firebase/analytics';
import { useCallback, useEffect } from 'react';

export const events = {
  'tutorial_sequence': 'tutorial_sequence',
  'tutorial_skip': 'tutorial_skip',
  'tutorial_get_started': 'tutorial_get_started',
  'onboarding_start_signup': 'onboarding_start_signup',
  'onboarding_signup_error': 'onboarding_signup_error',
  'onboarding_social_media': 'onboarding_social_media',
  /* not onboarding funnel */'create_social_media': 'create_social_media', // payload: platform, handle
  /* not onboarding funnel */'edit_social_media': 'edit_social_media', // payload: platform, handle
  'onboarding_social_media_submit': 'onboarding_social_media_submit',
  'onboarding_referral_source': 'onboarding_referral_source',
  'onboarding_pending_verification': 'onboarding_pending_verification',
  'onboarding_items': 'onboarding_items',
  /* not onboarding funnel */'create_item': 'create_item', // payload: source, type
  /* not onboarding funnel */'edit_item': 'edit_item', // payload: source, type
  'onboarding_items_submit': 'onboarding_items_submit',
  'onboarding_phone': 'onboarding_phone',
  'onboarding_photo': 'onboarding_photo',
  'onboarding_complete_screen': 'onboarding_complete_screen',
  'onboarding_complete': 'onboarding_complete',

};

// use effect api via useTracker(...) with params or call manually const {track} = useTracker();
// this normally fires once, so make sure that payload exists or include deps
export const useTracker = (eventName = null, payload = {  }, deps = []) => {
  const track = useCallback(async (eventName, payload = {}) => {
    if (!events[eventName]) {
      console.warn(`Tried to log an unknown event: ${eventName}`);
      return;
    }

    await analytics().logEvent(eventName, payload);
  });

  if (eventName) {
    useEffect(() => {
      track(eventName, payload);
    }, deps);
  }

  return { track };
};

