/* eslint-disable max-lines */
import React, {
  useState,
  useMemo,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import {View, Alert, Text, StyleSheet} from 'react-native';
import {COLORS} from 'Styles/colors.js';
import {ItemStore} from 'State/ItemContext';
import {Menu} from '@/Components/Menu';
import {Card} from '@/Components/Cards/Card';
import {Icon} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import tw from 'tw';
import {Containers, Typography} from 'Styles';

const ItemIcons = {
  subscription: 'vote-yea',
  call: 'user-friends',
  response: 'comment',
  link: 'link',
  content: 'file-invoice',
};

const Item = ({
  onPress,
  onLongPress,
  title,
  type,
  price,
  desc,
  loading,
  isEnabled,
}) => {
  const itemPrice = useMemo(() => {
    const basePrice = (price / 100).toFixed(2);
    return `$${basePrice}`;
  }, [price]);

  return (
    <View>
      <Card
        onPress={onPress}
        onLongPress={onLongPress}
        title={title}
        draggable
        loading={loading}
        renderIcon={
          isEnabled ? (
            <Icon
              color={COLORS.blue}
              size={24}
              type="font-awesome-5"
              name={ItemIcons[type] || 'ios-card'}
              solid
            />
          ) : (
            <Icon
              color={COLORS.red}
              size={24}
              type="font-awesome-5"
              name="exclamation-circle"
              solid
            />
          )
        }
        description={
          isEnabled
            ? type === 'link'
              ? desc
              : itemPrice
            : 'This item will not be displayed. Please finish item creation process.'
        }
      />
    </View>
  );
};

export const Items = ({forwardedRef}) => {
  const {itemState, itemActions} = useContext(ItemStore);
  const {navigate} = useNavigation();
  const [itemToEdit, setItemToEdit] = useState(false);
  const [listData, setListData] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [itemLoader, setItemLoader] = useState({});

  const renderItem = useCallback(
    ({item, drag}) => {
      return (
        <Item
          onLongPress={drag}
          onPress={() => setItemToEdit(item)}
          title={item.name}
          type={item.product_type}
          price={item.price}
          desc={item.description}
          loading={itemLoader[item.id]}
          isEnabled={item.is_enabled}
        />
      );
    },
    [itemLoader],
  );

  useEffect(() => {
    if (itemState.items && itemState.items.length) {
      const prepareData = [];
      for (const item of itemState.items) {
        prepareData.push(item);
      }
      prepareData.sort((a, b) => b.menu_order - a.menu_order);
      setListData(prepareData);
    }
  }, [itemState]);

  const deleteItem = (id) => {
    setItemLoader({...itemLoader, [id]: true});
    itemActions.removeInfluencerItem(id).then(() => {
      itemActions.getInfluencerItems().then(() => {
        setItemToEdit(false);
        setItemLoader({...itemLoader, [id]: false});
      });
    });
  };

  const navigateToWizard = () => {
    navigate('createItemPage', {
      itemToEdit,
      step:
        itemToEdit.product_type === 'content' && !itemToEdit.is_enabled
          ? 'itemDescription'
          : false,
    });
  };

  const saveList = async (list, from, to) => {
    //TODO: Refactor
    const orderedList = list;
    const steps = from - to;
    let toItem = to;
    let fromItem = from;

    if (steps > 0) {
      orderedList.reverse();
      toItem = orderedList.length - 1 - to;
      fromItem = orderedList.length - 1 - from;
    }
    for (let toOrder = fromItem + 1; toOrder <= toItem; toOrder++) {
      try {
        await itemActions.swapInfluencerItems({
          old_item_id: orderedList[fromItem].id,
          new_item_id: orderedList[toOrder].id,
        });
      } catch (error) {
        Alert.alert('Please try again later');
      }
    }
  };

  const reorderList = ({data, from, to}) => {
    saveList(listData, from, to);
    setListData(data);
    setIsDragging(false);
  };

  return (
    <>
      {itemState.items && itemState.items.length ? (
        <View style={styles.pageContainer}>
          <View style={tw('w-full pb-5')}>
            <Text style={styles.sectionTitle}>My Items</Text>
            <Menu
              isVisible={!!itemToEdit}
              onDismiss={() => setItemToEdit(false)}
              title="Item"
              actions={[
                {
                  icon: 'edit',
                  name: 'Edit',
                  color: COLORS.blue,
                  onActionPress: () => {
                    navigateToWizard();
                    setItemToEdit(false);
                  },
                },
                {
                  icon: 'delete',
                  name: 'Delete',
                  color: COLORS.red,
                  type: 'delete',
                  last: true,
                  onActionPress: () => {
                    deleteItem(itemToEdit.id);
                    setItemToEdit(false);
                  },
                },
              ]}
            />
            <DraggableFlatList
              simultaneousHandlers={isDragging ? false : forwardedRef}
              data={listData}
              renderItem={renderItem}
              keyExtractor={(item) => `draggable-item-${item.id}`}
              onDragEnd={reorderList}
              onDragBegin={() => setIsDragging(true)}
            />
          </View>
        </View>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    ...Containers.container,
  },
  sectionTitle: {
    ...Typography.title,
    marginVertical: 15,
  },
});
