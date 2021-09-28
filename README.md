# MyTexty Influencer App

## Refactors

### Sending the Bearer Token

```js
axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);
```

See the example [here](https://medium.com/swlh/handling-access-and-refresh-tokens-using-axios-interceptors-3970b601a5da)

```js
// Add a request interceptor
axios.interceptors.request.use(
  (config) => {
    const token = localStorageService.getAccessToken();
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    // config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);
```

### Responding to 401s

#### The response interceptor

See Proclaim Vue's `api.js`

```js
import get from 'lodash/get';

import authSubject from 'State/Services/authSubject';

api.interceptors.response.use(
  (config) => {
    return config;
  },
  (error) => {
    if (
      get(error, 'response.status') === 401 ||
      get(error, 'response.status') === 403
    ) {
      authSubject.next({type: 'LOGOUT'});
    }
    //  Can reformat errors globaly here
  },
);
```

#### Auth Subject

_Jack is working on this_

In `App/Pages/MainApp/index.js`

```js
import authSubject from 'State/Services/authSubject';


const Authentication = () => {
    useEffect(() => {
        const subscription =  authSubject.subscribe(async (payload) => {
            if (payload.type === "LOGOUT") {
                // JUST dispatch Logout action
            }
        });

    return () => subscription.unsubscribe();

    }, [])

    useEffect(() => {
        Actions.mainApp();
    }, [state.onboardingComplete])
    // rest of render code....
}



export Authentication

```

#### AuthContext

Logout action

```js
const logoutAction = async () => {
  // 1. Remove local Storage

  // 2. Remove any user state, any auth state, done Via dispatch LOGOUT_FINISH
  dispatch({type: LOGOUT_FINISH});
  // In reducer, remove user state, auth state

  // 3. Redirect
  Actions.login();
};
```

#### Start server for development

1. Start metro: `yarn run start`

If there is problem with JavaScript heap out of memory (it is caused by `aws-sdk/dist/aws-sdk-react-native`), then try to run `yarn run start-max` to start metro.

2. Start application

```yarn run ios```
```yarn run android```
