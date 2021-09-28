import moment from "moment";
import 'moment-timezone';

export const getTZOfssetInHours = () => {
  const offset = (new Date().getTimezoneOffset() / 60).toString()
  if (offset < 0) {
    return Math.abs(offset)
  } else {
    return (offset * -1)
  }
};

export const convertFromUTC = (date, tzString) => {
    let utcDate = moment(date, 'YYYY/MM/DD HH:mm:ss').tz('UTC', true);
    return utcDate.tz(tzString).toDate();
}
