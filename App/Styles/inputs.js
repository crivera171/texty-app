import tw from 'tw';
import {Typography} from './typography.js';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const Inputs = {
  datepickerContainer: tw(
    'pl-10 pr-1 py-3 bg-white border mt-4 border-light-gray rounded-md',
  ),
  datepickerText: tw('text-black text-lg'),
  itemInput: tw(
    'mt-1 py-2 px-4 bg-white border border-light-gray rounded-md text-base w-full',
  ),
  itemInputLabel: {...Typography.subtitle, ...tw('font-bold text-black')},
  itemInputContainer: tw('bg-white my-1 border-0'),
  inputContainer: tw(
    'px-1 py-2 bg-white border mt-4 border-light-gray rounded-md',
  ),
  inputError: tw('border-red'),
  checkboxContainer: {
    paddingVertical: hp(2),
  },
  textAreaContainer: tw(
    'p-5 mt-5 bg-white border border-light-gray rounded-md text-lg',
  ),
  checkbox: tw('w-6 h-6'),
  checkboxLabel: tw('px-8 text-base'),
  inputLabel: tw('ml-10 pt-3'),
  inputIcon: tw('ml-1 text-gray'),
  inputIconRight: tw('mr-3 text-blue'),
  noIconInput: tw('ml-6 pb-3'),
  dropdownIcon: tw('text-xl text-blue mr-3'),
  dropdownActiveLabel: tw('text-black'),
  dropdownLabel: tw('text-lg text-left text-black'),
  dropdown: tw('bg-white px-9 h-14 rounded-md border-light-gray'),
  dropdownItems: tw('justify-start'),
  dropdownContainerStyle: tw('h-16 mt-5'),
  itemDropdown: tw('px-3 border-light-gray'),
  itemDropdownLabel: tw('text-base text-left text-black'),
  itemDropdownContainer: tw('h-14 my-3'),
  validationError: tw('text-red ml-6 mt-2'),
  mainInput: tw(
    'mt-3 p-4 bg-white border border-blue rounded-md text-lg font-bold',
  ),
  mainInputLabel: tw('text-lg text-left text-black font-bold'),
  switchContainer: tw('flex-row justify-between items-center py-4'),
  inputHintText: tw('text-base text-left text-gray'),
  stackedInputWrapper: tw('my-3 border-b-0'),
  stackedDropdwown: {
    ...Typography.subtitle,
    ...tw('bg-white border-light-gray border rounded-lg  pt-3 px-6'),
  },
  stackedInput: {
    ...Typography.subtitle,
    ...tw('border-light-gray border rounded-lg pt-3 pl-6'),
  },
  stackedLabel: {
    ...Typography.subtitle,
    ...tw('mb-2 font-medium'),
  },
  stackedTextarea: {
    ...Typography.subtitle,
    paddingTop: hp(2),
    paddingBottom: hp(2),
    marginTop: hp(2),
    paddingLeft: wp(5),
    paddingRight: wp(5),
    fontSize: wp(4),
    minHeight: hp(20),
    textAlignVertical: 'top',
    ...tw('bg-white border border-light-gray rounded-md'),
  },
  inputNote: tw('text-gray text-sm'),
};
