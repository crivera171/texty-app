import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {Containers, Typography, Buttons} from 'Styles';
import {COLORS} from 'Styles/colors';
import {Icon} from 'react-native-elements';
import {Menu} from '@/Components/Menu';
import {format, parseISO} from 'date-fns';
import {convertFromUTC} from 'utils/time';
import tw from 'tw';
import {AlertBox} from '@/Components/AlertBox';

export const Appointment = ({appointment, onCancel, timezone}) => {
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refundModal, setRefundModal] = useState(false);
  const [time, setTime] = useState(false);

  useEffect(() => {
    if (appointment) {
      setTime(convertFromUTC(parseISO(appointment.start_time), timezone));
      setLoading(false);
    }
  }, [appointment]);

  return (
    <>
      {!loading && (
        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle}>
            {appointment.duration} Minute Consultation
          </Text>
          <View style={styles.mainContainer}>
            {modal ? (
              <Menu
                isVisible={true}
                onDismiss={() => setModal(false)}
                title="Item"
                actions={[
                  {
                    icon: 'cancel',
                    name: 'Cancel and refund purchase',
                    color: COLORS.red,
                    type: 'delete',
                    last: true,
                    onActionPress: () => {
                      setRefundModal(true);
                      setModal(false);
                    },
                  },
                ]}
              />
            ) : null}
            <View style={styles.timeContainer}>
              <Icon
                size={25}
                color={COLORS.blue}
                type="ionicon"
                name="md-calendar-sharp"
                style={styles.timeIcon}
              />
              <View style={styles.timeTextContainer}>
                <Text style={styles.timeHourText}>
                  {format(time, 'EEEE, MMM d')}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => setModal(true)}
              style={styles.editIconButton}>
              <Icon
                size={30}
                color={COLORS.darkGray}
                type="ionicon"
                name="ellipsis-vertical"
              />
            </TouchableOpacity>
          </View>

          <AlertBox
            visible={refundModal}
            onDismiss={() => setRefundModal(false)}
            onSubmit={() => {
              onCancel();
              setRefundModal(false);
            }}
            type="danger"
            title="Appoinment"
            text="Are you sure you would like to cancel and refund this order?"
          />

          <View style={styles.timeContainer}>
            <Icon
              size={25}
              color={COLORS.blue}
              type="ionicon"
              name="time-outline"
            />
            <View style={styles.timeTextContainer}>
              <Text style={styles.timeHourText}>at </Text>
              <Text style={styles.timeHourText}>{format(time, 'h:mm')}</Text>
              <Text style={styles.timeText}>{format(time, 'aaa')}</Text>
            </View>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  editIconButton: {
    ...Buttons.transparentButton,
    width: 50,
    overflow: 'visible',
  },
  cardTitle: {
    ...Typography.title,
    ...tw('mb-3'),
  },
  cardContainer: {
    ...Containers.container,
  },
  mainContainer: {
    ...tw('flex-row'),
    justifyContent: 'space-between',
    overflow: 'visible',
  },
  timeContainer: {
    ...tw('flex-row'),
    alignItems: 'center',
  },
  daysContainer: {
    ...tw('flex-row'),
    justifyContent: 'space-between',
    width: '80%',
  },
  timeTextContainer: {
    ...tw('flex-row'),
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  timeHourText: {
    ...Typography.subtitle,
  },
  timeText: {
    ...Typography.subtitle,
    textTransform: 'uppercase',
  },
  actionWrapper: {
    ...Buttons.transparentButton,
    ...tw('flex-col items-center'),
    height: 100,
    width: '100%',
  },
  actionIcon: {
    ...Typography.actionIcon,
  },
  actionTitle: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
  },
  actionText: {
    ...Typography.subtitle,
    textAlign: 'center',
  },
  actionDesc: {
    ...Typography.subtitle,
    fontSize: 14,
  },
  modalContainer: {
    ...tw('flex-col items-center'),
    marginTop: 10,
    width: '100%',
  },
  modalAction: {
    ...Buttons.transparentButton,
    justifyContent: 'center',
    width: '100%',
    marginTop: 40,
  },
  modalActionText: {
    ...Typography.subtitle,
    color: COLORS.blue,
  },
});
