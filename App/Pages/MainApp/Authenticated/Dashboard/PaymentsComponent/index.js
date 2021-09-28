import React, {useContext, useMemo} from 'react';
import {View, StyleSheet, Text, ActivityIndicator} from 'react-native';
import {COLORS} from 'Styles/colors.js';
import tw from 'tw';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {Icon} from 'react-native-elements';
import {convertFromMicros} from '@/utils/number';
import {format} from 'date-fns';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {DashboardStore} from 'State/DashboardContext';
import {Card} from '@/Components/Cards/Card';
import {Typography, Containers} from '@/Styles';

export const PaymentsComponent = () => {
  const {state: dashboardState} = useContext(DashboardStore);

  const isLoading = useMemo(() => {
    return dashboardState.loading;
  }, [dashboardState.paymentOverview]);

  const getPayments = useMemo(() => {
    if (
      dashboardState.paymentOverview.payout_history &&
      dashboardState.paymentOverview.payout_history.length
    ) {
      console.log(dashboardState.paymentOverview.payout_history)
      return dashboardState.paymentOverview.payout_history;
    }

    return [];
  }, [dashboardState.paymentOverview]);

  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <View style={tw('flex-row justify-center')}>
          <Text style={styles.title}>
            $
            {isLoading
              ? null
              : convertFromMicros(dashboardState.paymentOverview.total_owe, 2)}
          </Text>
          {isLoading ? (
            <View style={tw('justify-center')}>
              <ActivityIndicator size="large" color={COLORS.blue} />
            </View>
          ) : null}
        </View>
        <Text style={[styles.subtitle, tw('-mt-2 text-center')]}>
          Current Balance
        </Text>
      </View>
      <View style={[styles.container, tw('flex-row flex-wrap')]}>
        {[
          {
            icon: 'coins',
            label: 'Total Earnings',
            value: dashboardState.paymentOverview.total_earning,
          },
          {
            icon: 'undo',
            label: 'Refunds',
            value: dashboardState.paymentOverview.total_refund,
          },
        ].map((stat, idx) => (
          <View key={idx} style={tw('w-1/2 flex-row items-center')}>
            <Icon
              name={stat.icon}
              type="font-awesome-5"
              size={wp(5)}
              color={COLORS.blue}
              style={tw('pr-3')}
            />
            <View>
              <View style={tw('flex-row')}>
                <Text style={Typography.title}>
                  ${isLoading ? null : convertFromMicros(stat.value)}
                </Text>
                {isLoading ? (
                  <View style={tw('justify-center')}>
                    <ActivityIndicator size="small" color={COLORS.blue} />
                  </View>
                ) : null}
              </View>
              <Text style={styles.subtitle}>{stat.label}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.container}>
        <Text style={Typography.title}>Payment History</Text>

        <View style={tw('mt-4')}>
          {!isLoading ? (
            getPayments.length ? (
              getPayments.map((payment, idx) => (
                <Card
                  key={idx}
                  disabled
                  title={`$${convertFromMicros(payment.price, 2)}`}
                  renderIcon={
                    <Icon
                      color={COLORS.blue}
                      size={24}
                      type="font-awesome-5"
                      name="check-circle"
                      style={styles.planIcon}
                      solid
                    />
                  }
                  description={
                    'Paid on ' +
                    format(new Date(payment.created_at), 'd MMMM, uuuu')
                  }
                />
              ))
            ) : (
              <Text style={styles.subtitle}>No records found</Text>
            )
          ) : (
            <View style={tw('items-start')}>
              <ActivityIndicator size="small" color={COLORS.blue} />
            </View>
          )}
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export const styles = StyleSheet.create({
  container: {
    ...Containers.container,
    ...tw('py-5'),
  },
  title: {
    fontSize: wp(14),
    ...tw('text-blue font-bold text-center'),
  },
  subtitle: Typography.subtitle,
});
