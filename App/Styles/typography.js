import tw from 'tw';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

export const Typography = {
  title: {
    fontSize: wp(4.5),
    ...tw('text-black font-bold'),
  },
  subtitle: {
    fontSize: wp(4),
    ...tw('font-normal text-dark-gray'),
    lineHeight: 21,
  },
  notice: {
    fontSize: wp(3.5),
    ...tw('font-normal text-dark-gray'),
  },
};
