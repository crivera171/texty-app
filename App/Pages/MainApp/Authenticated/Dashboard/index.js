import React, {useEffect, useContext, useCallback} from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
  RefreshControl,
} from 'react-native';
import {Containers, Tabs, Typography} from 'Styles';
import {COLORS} from 'Styles/colors.js';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {ContactStore} from 'State/ContactContext';
import {DashboardStore} from 'State/DashboardContext';
import {OverviewComponent} from './OverviewComponent';
import {TransactionsComponent} from './TransactionsComponent';
import {PaymentsComponent} from './PaymentsComponent';
import {CreditsComponent} from './CreditsComponent';
import {Header} from '@/Components/Layout/Header';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

const initialLayout = {width: Dimensions.get('window').width};

const DashboardPage = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'overview', title: 'Overview'},
    {key: 'credits', title: 'Credits'},
    {key: 'transactions', title: 'Transactions'},
    {key: 'payments', title: 'Payments'},
  ]);
  const {actions: contactActions} = useContext(ContactStore);
  const {state: dashboardState, actions: dashboardActions} = useContext(
    DashboardStore,
  );

  useEffect(() => {
    dashboardActions.getTransactions();
  }, [dashboardActions.getTransactions]);

  useEffect(() => {
    contactActions.getContacts();
  }, [contactActions.getContacts]);

  useEffect(() => {
    dashboardActions.getPayments();
  }, [dashboardActions.getPayments]);

  const OverviewRoute = useCallback(
    () => (
      <View style={styles.pageContainer}>
        <OverviewComponent />
      </View>
    ),
    [],
  );

  const CreditsRoute = useCallback(
    () => (
      <View style={styles.pageContainer}>
        <CreditsComponent />
      </View>
    ),
    [],
  );

  const TransactionsRoute = useCallback(
    () => (
      <View style={styles.pageContainer}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={dashboardState.loading}
              onRefresh={() => dashboardActions.getTransactions()}
            />
          }>
          <TransactionsComponent
            loading={dashboardState.loading}
            transactions={dashboardState.transactions}
          />
        </ScrollView>
      </View>
    ),
    [dashboardState.transactions],
  );

  const PaymentsRoute = useCallback(
    () => (
      <View style={styles.pageContainer}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={dashboardState.loading}
              onRefresh={() => dashboardActions.getPayments()}
            />
          }>
          <PaymentsComponent loading={dashboardState.loading} />
        </ScrollView>
      </View>
    ),
    [dashboardState.payments],
  );

  const renderScene = SceneMap({
    overview: OverviewRoute,
    transactions: TransactionsRoute,
    credits: CreditsRoute,
    payments: PaymentsRoute,
  });

  return (
    <>
      <StatusBar translucent backgroundColor="#fff" barStyle="dark-content" />
      <Header hideBack hideDone title={routes[index].title} />
      <TabView
        style={Containers.tabContainer}
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={(tabProps) => (
          <SafeAreaView style={Tabs.tabBarContainer}>
            <TabBar
              {...tabProps}
              renderLabel={(props) => (
                <View style={styles.unreadContainer}>
                  <Text
                    numberOfLines={1}
                    style={{color: props.color, fontSize: wp(3.2)}}>
                    {props.route.title}
                  </Text>
                </View>
              )}
              indicatorStyle={Tabs.indicatorStyle}
              style={Tabs.tabBar}
              activeColor={COLORS.blue}
              inactiveColor={COLORS.black}
              labelStyle={Tabs.labelStyle}
            />
          </SafeAreaView>
        )}
      />
    </>
  );
};

export const styles = StyleSheet.create({
  pageContainer: {
    height: '100%',
  },
  activeTab: {
    backgroundColor: COLORS.lightGray,
    color: COLORS.black,
    fontSize: 24,
    fontWeight: 'bold',
    ...Typography.textCenter,
    paddingVertical: 20,
  },
});

export default DashboardPage;
