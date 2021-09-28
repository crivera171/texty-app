import tw from 'tw';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const Buttons = {
  primaryButton: tw(
    'bg-white border-blue text-center rounded-md border drop-shadow-none',
  ),
  dangerButton: tw('bg-red border-red'),
  lightButtonText: {
    fontSize: wp(4),
    ...tw('text-center text-blue capitalize font-normal'),
  },
  formButton: {
    ...tw('justify-center w-full'),
    paddingBottom: hp(3),
    paddingTop: hp(3),
  },
  transparentButtonText: tw('text-blue py-5'),
  roundedIconButton: tw('bg-blue w-14 h-14 rounded'),
  floaterButton: tw(
    'absolute top-0 right-1 bottom-0 justify-center items-center',
  ),
  addMoreButton: {
    ...tw(
      'flex-row items-center bg-white border-dashed text-center rounded-md border drop-shadow-none justify-center w-full border-light-gray',
    ),
    minHeight: hp(10),
    marginBottom: hp(1),
  },
  plusButtonText: tw('text-center text-lg text-black'),
  addButtonText: tw('text-center text-lg text-black'),
  actionWrapper: tw('w-full py-1 justify-start'),
};
