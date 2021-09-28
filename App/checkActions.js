import * as authActions from './State/AuthContext/actions';
import * as contactActions from './State/ContactContext/actions';
import * as dashboardActions from './State/DashboardContext/actions';
import * as messageActions from './State/MessageContext/actions';
import * as profileActions from './State/ProfileContext/actions';

const checkActions = (actionMap) => {
  Object.keys(actionMap).forEach((key) => {
    // console.log(key, actionMap[key]);
    if (key !== actionMap[key]) {
      // eslint-disable-next-line no-console
      console.error('KEYS DO NOT MATCH: ', key, actionMap[key]);
    }
  });
};

checkActions(authActions);
checkActions(contactActions);
checkActions(dashboardActions);
checkActions(messageActions);
checkActions(profileActions);
