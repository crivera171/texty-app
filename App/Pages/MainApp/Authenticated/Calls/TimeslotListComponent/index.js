import React, {useContext, useMemo, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Containers, Typography, Buttons} from 'Styles';
import {TimeslotStore} from 'State/TimeslotContext';
import {ProfileStore} from 'State/ProfileContext';
import {Timeslot} from '../TimeslotComponent';
import {useNavigation} from '@react-navigation/native';
import {ItemStore} from 'State/ItemContext';
import tw from 'tw';

export const TimeslotList = () => {
  const {state: timeslotState, actions} = useContext(TimeslotStore);
  const [modal, setModal] = useState(false);
  const {state: influencerState} = useContext(ProfileStore);
  const influencer = influencerState.profile;
  const {navigate} = useNavigation();
  const {itemState, itemActions} = useContext(ItemStore);

  const itemsWithoutSlots = useMemo(
    () => itemState.unslottedItems.filter((i) => !i.timeslots?.length),
    [itemState.unslottedItems],
  );

  const defaultTimeslots = useMemo(
    () => timeslotState.timeslots?.filter((timeslot) => timeslot.is_default),
    [timeslotState],
  );

  const onEdit = (timeslotVal) => {
    navigate('createTimeslotPage', {timeslot: timeslotVal});
  };

  const onDelete = (timeslotId) => {
    actions.removeTimeslot(timeslotId).then(() => {
      itemActions.getUnslottedItems();
      actions.getTimeslots(influencer.influencer_id);
    });
  };

  return (
    <View style={styles.timeslotListContainer}>
      {itemsWithoutSlots.length && !defaultTimeslots?.length ? (
        <View style={tw('p-4 m-2 border border-red bg-red rounded-md')}>
          <Text style={[Typography.notice, tw('text-white')]}>
            Some of your items are not available until you assign timeslots for
            them.
          </Text>
        </View>
      ) : null}

      {timeslotState.timeslots && timeslotState.timeslots.length ? (
        timeslotState.timeslots.map((item) => (
          <Timeslot
            key={item.id}
            timeslot={item}
            optionsVisible={modal === item.id}
            onOptionsOpen={() => setModal(item.id)}
            onOptionsClose={() => setModal(false)}
            onDelete={() => onDelete(item.id)}
            onEdit={() => onEdit(item)}
          />
        ))
      ) : (
        <View style={styles.timeslotLoader}>
          <Text style={styles.loaderText}>
            Create a timeslot to let your fans book calls
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...Containers.container,
    ...tw('mt-4'),
  },
  timeslotListContainer: {
    paddingBottom: 40,
  },
  addMoreButton: {
    ...Buttons.addMoreButton,
  },
  plusButtonText: {
    ...Buttons.plusButtonText,
  },
  addButtonText: {
    ...Buttons.addButtonText,
  },
  timeslotLoader: {
    ...Containers.loader,
    ...tw('mt-4'),
  },
  loaderText: {
    ...Typography.subtitle,
    ...tw('text-center'),
  },
});
