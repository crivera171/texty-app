import React, {useMemo} from 'react';
import {View, StyleSheet, Text, Linking, TouchableOpacity} from 'react-native';
import {Containers, Typography} from '@/Styles';
import {COLORS} from 'Styles/colors.js';
import {format} from 'date-fns';
import {APP_URL} from 'State/Constants';
import {Icon} from 'react-native-elements';
import tw from 'tw';
import {Card} from '@/Components/Cards/Card';

const convertFromMicros = (p) => {
  return (p / 100).toFixed(2);
};

const ItemIcons = {
  audio: 'volume-high',
  video: 'videocam',
  call: 'call',
};

export const TransactionsComponent = ({transactions, loading}) => {
  const getContactName = (contact) => {
    return contact;
    //return JSON.parse(contact);
  };

  const sortedTransactions = useMemo(() => {
    if (transactions.data && transactions.data.length) {
      const sortedArr = transactions.data.sort(
        (a, b) => new Date(b.updated_at) - new Date(a.updated_at),
      );
      return sortedArr;
    }
    return [];
  }, [transactions]);

  const goToHelp = () => {
    Linking.openURL(APP_URL + '/help');
  };

  return (
    <View style={styles.infoContainer}>
      {sortedTransactions.length ? (
        sortedTransactions.map((order, idx) => (
          <Card
            key={idx}
            disabled
            title={`${order.customer_description} ${
              order.status === 'refund' ? '-' : ''
            }${
              order.total === 0 ? 'Free' : `$${convertFromMicros(order.total)}`
            }`}
            renderIcon={
              order.status === 'refund' ? (
                <Icon
                  size={24}
                  color={COLORS.blue}
                  type="ionicon"
                  name="reload-outline"
                />
              ) : (
                <Icon
                  size={24}
                  color={COLORS.blue}
                  type="ionicon"
                  name={ItemIcons[order.item_type] || 'ios-card'}
                />
              )
            }
            description={`${
              getContactName(order.contact_object).full_name
            } - ${format(new Date(order.updated_at), 'M/d/yyyy')}`}
          />
        ))
      ) : (
        <View style={tw('py-6')}>
          <Text style={[Typography.subtitle, tw('text-center')]}>
            We could not locate any order history just yet.
          </Text>
        </View>
      )}

      <View style={tw('w-full')}>
        <TouchableOpacity onPress={goToHelp}>
          <Text style={styles.getHelpText}>
            Questions about your orders? Get Help
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    ...Containers.container,
  },
  getHelpText: {
    ...Typography.subtitle,
    ...tw('text-center text-blue'),
  },
});
