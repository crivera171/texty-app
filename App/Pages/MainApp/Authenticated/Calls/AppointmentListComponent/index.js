import React, {useContext} from 'react';
import {StyleSheet, Text, View, ScrollView, RefreshControl} from 'react-native';
import {Containers, Typography, Buttons} from 'Styles';
import {TimeslotStore} from 'State/TimeslotContext';
import {ProfileStore} from 'State/ProfileContext';
import {Appointment} from '../AppointmentComponent';
import tw from 'tw';

export const AppointmentList = () => {
  const {state: timeslotState, actions} = useContext(TimeslotStore);
  const {state: influencerState} = useContext(ProfileStore);
  const influencer = influencerState.profile;

  const removeAppointment = (id) => {
    actions.removeAppointment(id).then(() => {
      actions.getAppointments(influencer.timezone_name);
    });
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={timeslotState.loading}
          onRefresh={() => {
            actions.getAppointments(influencer.timezone_name);
          }}
        />
      }>
      <View style={styles.timeslotListContainer}>
        {timeslotState.appointments ? (
          timeslotState.appointments.map((appointment, id) => (
            <Appointment
              appointment={appointment}
              timezone={influencer.timezone_name}
              onCancel={() => removeAppointment(appointment.id)}
              key={id}
            />
          ))
        ) : (
          <View style={styles.appointmentLoader}>
            <Text style={styles.loaderText}>
              You have no scheduled appointments
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...Containers.cardContainer,
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
  appointmentLoader: {
    ...Containers.loader,
    ...tw('mt-4'),
  },
  loaderText: {
    ...Typography.subtitle,
    ...tw('text-center'),
  },
});
