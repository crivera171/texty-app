import React, {useState} from 'react';
import {View, StyleSheet, Text, ActivityIndicator} from 'react-native';
import {COLORS} from 'Styles/colors.js';
import {LineChart} from 'react-native-chart-kit';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {Rect, Text as TextSVG, Svg} from 'react-native-svg';
import {convertFromMicros} from '@/utils/number';
import tw from 'tw';
import {Typography} from 'Styles';

const Chart = ({data, shouldConvert, loading}) => {
  const [tooltipPos, setTooltipPos] = useState({
    x: 0,
    y: 0,
    visible: false,
    value: 0,
  });

  return (
    <View style={styles.container}>
      {data && data.datasets[0].data.length ? (
        <LineChart
          data={data}
          width={wp(100)} // from react-native
          height={220}
          yAxisLabel={shouldConvert ? '$' : ''}
          fromZero
          withVerticalLines={false}
          formatYLabel={(x) => (shouldConvert ? convertFromMicros(x) : x)}
          chartConfig={{
            decimalPlaces: 0,
            propsForBackgroundLines: {
              strokeDasharray: '', // solid background lines with no dashes
              stroke: COLORS.gray,
            },
            backgroundColor: COLORS.white,
            backgroundGradientFrom: COLORS.white,
            backgroundGradientTo: COLORS.white,
            color: () => COLORS.blue,
            labelColor: () => COLORS.darkGray,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '1',
              stroke: COLORS.blue,
            },
            propsForLabels: {
              fontSize: wp(3),
            },
          }}
          bezier
          decorator={() => {
            return tooltipPos.visible ? (
              <View>
                <Svg>
                  <Rect
                    x={tooltipPos.x - 15}
                    y={tooltipPos.y + 10}
                    width="60"
                    height="30"
                    fill={COLORS.blue}
                  />
                  <TextSVG
                    x={tooltipPos.x + 14}
                    y={tooltipPos.y + 30}
                    fill="white"
                    fontSize={wp(3.5)}
                    textAnchor="middle">
                    {tooltipPos.value}
                  </TextSVG>
                </Svg>
              </View>
            ) : null;
          }}
          onDataPointClick={(pointData) => {
            const isSamePoint =
              tooltipPos.x === pointData.x && tooltipPos.y === pointData.y;

            isSamePoint
              ? setTooltipPos((previousState) => {
                  return {
                    ...previousState,
                    value: pointData.value,
                    visible: !previousState.visible,
                  };
                })
              : setTooltipPos({
                  x: pointData.x,
                  value: shouldConvert
                    ? '$' + convertFromMicros(pointData.value, 2)
                    : pointData.value,
                  y: pointData.y,
                  visible: true,
                });
          }}
        />
      ) : (
        <View>
          {loading ? (
            <ActivityIndicator color={COLORS.gray} />
          ) : (
            <Text style={(Typography.notice, tw('text-center'))}>
              No records found
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    minHeight: 250,
    width: wp(100),
    ...tw('items-center justify-center'),
  },
});

export default Chart;
