import tw from 'tw';
import {COLORS} from 'Styles/colors';

export const Tabs = {
  tabBar: {
    ...tw('text-blue bg-white'),
    elevation: 0,
    borderBottomWidth: 1,
    borderColor: COLORS.gray,
  },
  labelStyle: {
    ...tw('capitalize text-blue'),
  },
  indicatorStyle: tw('text-blue bg-blue'),
  notice: tw('flex-row justify-evenly w-full'),
};
