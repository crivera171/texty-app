import React, {useEffect, useContext, useMemo} from 'react';
import {OnboardingStore} from 'State/OnboardingContext';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS} from '@/Styles/colors.js';
import {TaskComponent} from '../TaskComponent';
import {useNavigation} from '@react-navigation/native';
import {Typography, Containers} from 'Styles';
import tw from 'tw';

export const TaskList = () => {
  const {onboardingState: state, onboardingActions: actions} = useContext(
    OnboardingStore,
  );
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      actions.getInfluencerTasks();
    });
    return unsubscribe;
  }, [navigation, actions.getInfluencerTasks]);

  const taskList = [
    {
      type: 'response_item',
      name: 'Create a response item',
      icon: 'chatbubble-outline',
      color: COLORS.blue,
      onPress: () =>
        navigation.navigate('CreateItemPage', {
          itemToEdit: {product_type: 'response'},
        }),
    },
    {
      type: 'call_item',
      name: 'Create a call item',
      icon: 'call',
      color: COLORS.red,
      onPress: () =>
        navigation.navigate('createItemPage', {
          itemToEdit: {product_type: 'call'},
        }),
    },
    {
      type: 'has_schedule',
      name: 'Set your meeting availability',
      icon: 'calendar',
      color: COLORS.yellow,
      onPress: () => navigation.navigate('createTimeslotPage', {}),
    },
  ];

  const availableTasks = useMemo(() => {
    const tt = [];
    const tasks = state.tasks;
    if (tasks) {
      taskList.map((task) => {
        if (tasks.hasOwnProperty(task.type) && !tasks[task.type]) {
          tt.push(task);
        }
      });
    }
    return tt;
  }, [state]);

  return (
    <>
      {availableTasks.length ? (
        <View style={styles.pageContainer}>
          <View style={tw('w-full pb-5')}>
            <Text style={styles.sectionTitle}>My Tasks</Text>
            {availableTasks.map((task, idx) => (
              <TaskComponent key={idx} data={task} />
            ))}
          </View>
        </View>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    ...Typography.title,
    marginVertical: 15,
  },
  pageContainer: {
    ...Containers.container,
  },
});
