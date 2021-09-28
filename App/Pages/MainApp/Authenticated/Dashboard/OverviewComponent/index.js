/* eslint-disable max-lines */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useContext, useEffect, useMemo} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {COLORS} from 'Styles/colors.js';
import {Containers, Typography} from 'Styles';
import tw from 'tw';
import {ButtonGroup} from 'react-native-elements';
import {Picker} from '@/Components/Inputs/Picker';
import Chart from './Chart';
import {periods, metrics, labels, filters} from './constants';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {DashboardStore} from 'State/DashboardContext';
import {convertFromMicros} from '@/utils/number';

export const OverviewComponent = () => {
  const {actions} = useContext(DashboardStore);
  const [type, setType] = useState(0);
  const [metric, setMetric] = useState('revenue');
  const [period, setPeriod] = useState('today');
  const [overviewData, setOverviewData] = useState();
  const [chartData, setChartData] = useState(false);
  const [chartDataLoading, setChartDataLoading] = useState(true);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const metricData = useMemo(() => {
    if (overviewLoading) {
      return metrics.filter((m) => m.type === type);
    }

    return overviewData;
  }, [overviewData, type, overviewLoading]);

  const getSorted = useMemo(() => {
    return metrics.filter((m) => m.type === type);
  }, [type]);

  const getFilters = useMemo(() => {
    return filters.filter((f) => f.type === type);
  }, [type]);

  const isMoney = useMemo(() => {
    const filtersArr = getFilters.find((x) => x.key === metric);
    if (filtersArr) {
      return filtersArr.valueType === 'sum';
    }
    return false;
  }, [metric]);

  useEffect(() => {
    setChartDataLoading(true);
    actions
      .getChartData(period, metric)
      .then((val) => {
        const data = val.data?.map((d) => parseInt(d.value, 10));
        setChartData({
          labels: labels[period],
          datasets: [{data}],
        });
        setChartDataLoading(false);
        setRefreshing(false);
      })
      .catch(() => {
        setChartData({
          labels: labels[period],
          datasets: [{data: []}],
        });
        setChartDataLoading(false);
        setRefreshing(false);
      });
  }, [actions.getChartData, period, metric, refreshing]);

  useEffect(() => {
    setOverviewLoading(true);
    actions.getOverview(period).then((val) => {
      const metricObj = [];
      for (const i in getSorted) {
        const value = val[getSorted[i].key][0][getSorted[i].valueType];
        metricObj.push({
          ...getSorted[i],
          value: value ? value : 0,
        });
      }
      setOverviewData(metricObj);
      setOverviewLoading(false);
      setRefreshing(false);
    });
  }, [actions.getOverview, period, getSorted, refreshing]);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            setPeriod(period);
            setMetric(metric);
          }}
        />
      }>
      <View style={styles.section}>
        <View style={styles.container}>
          <ButtonGroup
            onPress={(t) => {
              if (t === 0) {
                setMetric('revenue');
              } else {
                setMetric('fans');
              }
              setType(t);
            }}
            selectedIndex={type}
            buttons={['Earnings', 'Activity']}
            buttonStyle={tw('rounded-full')}
            buttonContainerStyle={tw('border-0')}
            containerStyle={[
              tw('rounded-full bg-light-gray'),
              {height: 40, borderWidth: 1, borderColor: COLORS.gray},
            ]}
            selectedButtonStyle={tw('rounded-full bg-white')}
            textStyle={[Typography.notice, tw('text-dark-gray')]}
            selectedTextStyle={tw('text-blue')}
            Component={TouchableWithoutFeedback}
          />
        </View>
        <View style={styles.container}>
          <View style={tw('flex-row pt-1 pb-3 items-center justify-between')}>
            <View style={tw('h-full items-center')}>
              <Picker
                hideLabel
                defaultValue={period}
                values={periods}
                onChangeItem={(val) => setPeriod(val)}
                placeholder="Select"
                inputStyle={[
                  tw('p-2 justify-start items-center mt-0'),
                  {minHeight: hp(4)},
                ]}
                inputTextStyle={[Typography.notice, tw('pr-2')]}
              />
            </View>
          </View>
        </View>
        <View style={tw('pb-2 bg-white')}>
          <Chart
            loading={chartDataLoading}
            data={chartData}
            shouldConvert={isMoney}
          />
        </View>

        <View style={tw('flex-row justify-between items-center')}>
          {getFilters.map((item) => (
            <TouchableWithoutFeedback
              key={item.key}
              onPress={() => setMetric(item.key)}>
              <View
                style={tw(
                  `${
                    item.key === metric
                      ? 'border-t-2 border-blue'
                      : 'border-t border-gray'
                  } flex-1 py-2`,
                )}>
                <Text
                  style={[
                    Typography.notice,
                    tw('text-center'),
                    {
                      color:
                        item.key === metric ? COLORS.blue : COLORS.darkGray,
                    },
                  ]}>
                  {item.title}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          ))}
        </View>
      </View>
      <View style={[styles.section, tw('mb-4')]}>
        <View style={[styles.container, tw('py-0')]}>
          {metricData.map((item, idx) => (
            <View
              key={item.key}
              style={[
                styles.innerContainer,
                idx === 0 ? tw('border-0') : null,
              ]}>
              <Text style={Typography.notice}>{item.label}</Text>
              {overviewLoading ? (
                <ActivityIndicator color={COLORS.gray} />
              ) : (
                <Text style={Typography.notice}>
                  {item.valueType === 'sum'
                    ? '$' + convertFromMicros(item.value)
                    : item.value}
                </Text>
              )}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export const styles = StyleSheet.create({
  container: {
    ...Containers.container,
    ...tw('bg-white border-0'),
  },
  section: Containers.section,
  innerContainer: {
    borderTopWidth: 1,
    ...tw('py-3 border-gray flex-row justify-between flex-1'),
  },
});
