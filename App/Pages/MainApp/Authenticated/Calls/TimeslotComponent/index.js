import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {Containers, Typography, Buttons} from 'Styles';
import {COLORS} from 'Styles/colors';
import {Menu} from '@/Components/Menu';
import {Day} from '@/Components/Shared/Data/Day';
import {Icon} from 'react-native-elements';
import tw from 'tw';

export const Timeslot = ({
  optionsVisible,
  timeslot,
  onOptionsOpen,
  onOptionsClose,
  onEdit,
  onDelete,
}) => {
  return (
    <>
      <View style={[styles.cardContainer, optionsVisible && styles.show]}>
        <Text style={styles.cardTitle}>Timeslot</Text>
        <View style={styles.mainContainer}>
          <View style={styles.daysContainer}>
            {[
              {name: 'SU', id: 7},
              {name: 'MO', id: 1},
              {name: 'TU', id: 2},
              {name: 'WE', id: 3},
              {name: 'TH', id: 4},
              {name: 'FR', id: 5},
              {name: 'SA', id: 6},
            ].map((day) => (
              <Day
                active={timeslot.days && timeslot.days.includes(day.id)}
                key={day.id}
                text={day.name}
              />
            ))}
          </View>
          <TouchableOpacity
            onPress={onOptionsOpen}
            style={styles.editIconButton}>
            <Icon
              type="ionicon"
              style={styles.cardTitle}
              name="ellipsis-vertical"
              color={COLORS.darkGray}
              fontSize={30}
            />
          </TouchableOpacity>

          <Menu
            isVisible={optionsVisible}
            onDismiss={onOptionsClose}
            title="Timeslot"
            actions={[
              {
                icon: 'edit',
                name: 'Edit',
                color: COLORS.blue,
                onActionPress: () => {
                  onEdit();
                  onOptionsClose();
                },
              },
              {
                icon: 'delete',
                name: 'Delete',
                color: COLORS.red,
                type: 'delete',
                last: true,
                onActionPress: () => {
                  onDelete();
                  onOptionsClose();
                },
              },
            ]}
          />
          <View style={styles.timeContainer}>
            <Icon
              type="ionicon"
              name="time-outline"
              color={COLORS.blue}
              fontSize={30}
              style={styles.timeIcon}
            />
            <View style={styles.timeTextContainer}>
              <Text style={styles.timeHourText}>{timeslot.startTime[0]}</Text>
              <Text style={styles.timeText}>{timeslot.startTime[1]}</Text>
              <Text> - </Text>
              <Text style={styles.timeHourText}>{timeslot.endTime[0]}</Text>
              <Text style={styles.timeText}>{timeslot.endTime[1]}</Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  show: {
    zIndex: 15,
  },
  editIconButton: {
    ...Buttons.transparentButton,
    width: 50,
    justifyContent: 'center',
  },
  cardTitle: {
    ...Typography.title,
  },
  cardContainer: {
    ...Containers.container,
  },
  mainContainer: {
    ...tw('flex-row'),
    justifyContent: 'space-between',
    overflow: 'visible',
    flexWrap: 'wrap',
  },
  timeContainer: {
    ...tw('flex-row'),
    alignItems: 'center',
    width: '100%',
  },
  daysContainer: {
    ...tw('flex-row'),
    justifyContent: 'space-between',
    width: '80%',
    paddingVertical: 20,
  },
  timeTextContainer: {
    ...tw('flex-row'),
    alignItems: 'flex-end',
  },
  timeIcon: {
    marginRight: 10,
  },
  timeHourText: {
    ...Typography.subtitle,
  },
  timeText: {
    ...Typography.subtitle,
    textTransform: 'uppercase',
  },
  actionsContainer: {
    ...Containers.actionContainer,
  },
  actionWrapper: {
    ...Buttons.actionWrapper,
  },
  actionIcon: {
    ...Typography.actionIcon,
  },
  actionText: {
    ...Typography.subtitle,
  },
});
