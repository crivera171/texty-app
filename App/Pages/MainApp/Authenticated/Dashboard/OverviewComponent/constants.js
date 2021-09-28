import {
  format,
  startOfMonth,
  addDays,
  subMonths,
  differenceInCalendarMonths,
} from 'date-fns';

const getFourDayIntervalsInMonth = (date) => {
  let start = startOfMonth(date);
  const days = [];
  while (differenceInCalendarMonths(start, date) === 0) {
    days.push(format(start, 'MM-dd'));
    start = addDays(start, 4);
  }

  return days;
};

export const periods = [
  {label: 'Today', value: 'today'},
  {label: 'This week', value: 'this_week'},
  {label: 'Last week', value: 'last_week'},
  {label: 'This month', value: 'this_month'},
  {label: 'Last month', value: 'last_month'},
  {label: 'This year', value: 'year_to_date'},
];

export const labels = {
  today: ['12 AM', '4 AM', '8 AM', '12 PM', '4PM', '8PM'],
  this_week: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
  last_week: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
  this_month: getFourDayIntervalsInMonth(new Date()),
  last_month: getFourDayIntervalsInMonth(subMonths(new Date(), 1)),
  year_to_date: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
};

export const filters = [
  {title: 'Revenue', key: 'revenue', type: 0, valueType: 'sum'},
  {
    title: 'Sub. Revenue',
    key: 'subscription_revenue',
    type: 0,
    valueType: 'sum',
  },
  {title: 'Orders', key: 'orders', type: 0, valueType: 'count'},
  {title: 'Subscriptions', key: 'subscriptions', type: 0, valueType: 'count'},
  {title: 'Fans', key: 'fans', type: 1, valueType: 'count'},
  {title: 'Customers', key: 'customers', type: 1, valueType: 'count'},
  {title: 'Subscribers', key: 'subscribers', type: 1, valueType: 'count'},
  {title: 'Messages', key: 'messages', type: 1, valueType: 'count'},
];

export const metrics = [
  {
    key: 'net_earning',
    label: 'Revenue',
    valueType: 'sum',
    type: 0,
  },
  {
    key: 'net_refunds',
    label: 'Refunds',
    valueType: 'sum',
    type: 0,
  },
  {
    key: 'total_subscription',
    label: 'Subscriptions',
    valueType: 'sum',
    type: 0,
  },
  {
    key: 'num_messages',
    label: 'Messages',
    valueType: 'count',
    type: 1,
  },
  {
    key: 'num_orders',
    label: 'Orders',
    valueType: 'count',
    type: 1,
  },
  {
    key: 'num_subscribers',
    label: 'Subscribers',
    valueType: 'count',
    type: 1,
  },
  {
    key: 'subscription_count',
    label: 'Subscriptions',
    valueType: 'count',
    type: 1,
  },
];
