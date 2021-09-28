import React, {useMemo, useCallback, useContext} from 'react';
import {View, StyleSheet} from 'react-native';
import {TimeslotsForm} from '@/Components/Shared/Forms/Timeslots';
import {TimeslotStore} from 'State/TimeslotContext';
import {ProfileStore} from 'State/ProfileContext';
import {COLORS} from 'Styles/colors.js';
import {ItemStore} from 'State/ItemContext';
import {Inputs, Containers, Typography, Buttons} from '@/Styles';

const CreateTimeslotPage = ({route, navigation}) => {
  const {timeslot} = route.params;
  const {state, actions} = useContext(TimeslotStore);
  const {state: influencerState} = useContext(ProfileStore);
  const influencer = influencerState.profile;
  const {itemActions} = useContext(ItemStore);

  const close = () => {
    navigation.goBack();
  };

  const onFormSubmit = useCallback(
    ({days, start, end, id, items, is_default}) =>
      actions
        .saveTimeslot({
          days,
          start,
          end,
          timezone: influencer.timezone_name,
          id,
          items,
          is_default,
        })
        .then(() => {
          itemActions.getUnslottedItems();
          actions.getTimeslots(influencer.influencer_id).then(() => close());
        }),
    [
      actions.saveTimeslot,
      itemActions.getUnslottedItems,
      actions.getTimeslots,
      influencer,
    ],
  );

  const initialValues = useMemo(() => {
    if (timeslot) {
      return timeslot;
    }
    return {};
  }, [timeslot]);

  return (
    <View style={Containers.background}>
      <TimeslotsForm
        onFormSubmit={onFormSubmit}
        onDismiss={close}
        loading={state.loading}
        initialValues={initialValues}
      />
    </View>
  );
};

export default CreateTimeslotPage;
