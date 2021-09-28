//Array of onboarding pages in order.
import {useNavigationState} from '@react-navigation/native';
import {useMemo} from 'react';

// TODO: Not the best approach, need to
//  think how to refactor this to avoid duplicate
//  route names here and in MainApp/index.js

const onboardingScreenNames = [
  'socialMediaPage',
  'storyPage',
  'pendingApplicationPage',
  'numberConfigPage',
  'profilePicturePage',
];

// use caution as this hook will only work under MainApp/index.js nested routes
export const useOnbordingSteps = () => {
  const routeIndex = useNavigationState((state) => state.index);
  const routes = useNavigationState((state) => state.routes);

  const currentStep = useMemo(() => routes[routeIndex].name, [
    routeIndex,
    routes,
  ]);
  const nextStep = useMemo(() => {
    const onboardingScreenIndex = onboardingScreenNames.findIndex(
      (route) => route === routes[routeIndex].name,
    );
    if (onboardingScreenIndex > -1) {
      return onboardingScreenNames[onboardingScreenIndex + 1]
        ? onboardingScreenNames[onboardingScreenIndex + 1]
        : 'authenticatedPage';
    }
    return 'authenticatedPage';
  }, [routeIndex, routes]);

  return {currentStep, nextStep};
};
