import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useContext,
} from 'react';
import {View, Alert, SafeAreaView} from 'react-native';
import {ItemStore} from 'State/ItemContext';
import {Header} from '@/Components/Layout/Header';
import {ItemName} from '@/Components/Shared/Forms/Items/ItemName';
import {ItemDesc} from '@/Components/Shared/Forms/Items/ItemDesc';
import {ItemInstructions} from '@/Components/Shared/Forms/Items/ItemInstructions';
import {ItemType} from '@/Components/Shared/Forms/Items/ItemType';
import {ItemPrice} from '@/Components/Shared/Forms/Items/ItemPrice';
import tw from 'tw';

const CreateItemPage = ({route, navigation}) => {
  const [step, setStep] = useState(route.params.step || 'itemType');

  const {itemToEdit} = route.params;
  const [data, setData] = useState({});
  const [locked, setLocked] = useState(false);
  const {itemActions} = useContext(ItemStore);

  useEffect(() => {
    if (itemToEdit) {
      itemToEdit.type = itemToEdit.product_type;
    }
  }, [itemToEdit]);

  const initialValues = useMemo(() => {
    if (itemToEdit) {
      const makeValues = {
        ...itemToEdit,
        type: itemToEdit.product_type,
        editing_id: itemToEdit.id,
        ...data,
      };
      return makeValues;
    }
    return data;
  }, [itemToEdit, data]);

  const steps = useMemo(() => {
    //TODO: Refactor
    const components = [
      {key: 'itemType', title: 'Type', component: ItemType},
      {key: 'itemTitle', title: 'Title', component: ItemName},
      {key: 'itemDescription', title: 'Description', component: ItemDesc},
      {
        key: 'itemInstruction',
        title: 'Instructions',
        component: ItemInstructions,
      },
      {key: 'itemPrice', title: 'Pricing', component: ItemPrice},
    ];

    if (data.type === 'link') {
      components.pop();
      components.pop();
    }

    if (data.type === 'subscription') {
      components[3].title = 'Includes';
    }

    if (data.type === 'content') {
      components.splice(3, 1);
    }

    return components;
  }, [data]);

  const currentStepIndex = useMemo(() => {
    return steps.findIndex((wizardStep) => wizardStep.key === step);
  }, [steps, step]);

  const saveItem = useCallback(
    ({
      type,
      name,
      hashtag,
      description,
      instructions,
      price,
      call_type,
      call_url,
      call_duration,
      editing_id,
      discounts,
      is_enabled,
      includes,
    }) => {
      return itemActions
        .saveInfluencerItem({
          type,
          name,
          hashtag,
          description,
          instructions,
          price,
          call_type,
          call_url,
          call_duration,
          editing_id,
          is_enabled,
          discounts,
          subscription_desc: includes,
        })
        .then(async (item) => {
          await itemActions.getUnslottedItems();
          await itemActions.getInfluencerItems();
          return item;
        })
        .catch(() => {
          Alert.alert('Could not create the item. Please try again later.');
        });
    },
    [itemActions.saveInfluencerItem],
  );

  const close = () => navigation.goBack();

  const next = async (val) => {
    if (locked) {
      return;
    }
    setLocked(true);
    const itemData = {...initialValues, ...val};
    if (steps.length <= currentStepIndex + 1) {
      try {
        await saveItem({...itemData, is_enabled: true});
        close();
        setLocked(false);
      } catch (err) {
        setLocked(false);
      }
    } else if (currentStepIndex === 1 && data.type === 'content') {
      try {
        const contentItem = await saveItem({...itemData, is_enabled: false});
        setData({...itemData, editing_id: contentItem.id});
        setStep(steps[currentStepIndex + 1].key);
        setLocked(false);
      } catch (err) {
        setLocked(false);
      }
    } else {
      setData(itemData);
      setStep(steps[currentStepIndex + 1].key);
      setLocked(false);
    }
  };

  const back = () => {
    setStep(steps[currentStepIndex - 1].key);
  };

  useEffect(() => {
    setData(initialValues);
  }, []);

  const getStepComponent = (key) => {
    const stepEl = steps.find((wizardStep) => wizardStep.key === key);
    return (
      <stepEl.component
        initialValues={initialValues}
        onBack={back}
        onSubmit={next}
        last={steps[steps.length - 1].key === key}
        loading={locked}
      />
    );
  };

  return (
    <SafeAreaView style={tw('bg-white flex-1')}>
      <Header
        title={steps[currentStepIndex].title}
        backTitle="Close"
        handleBack={close}
        loading={locked}
        hideDone
      />
      <View style={tw('flex-1')}>{getStepComponent(step)}</View>
    </SafeAreaView>
  );
};

export default CreateItemPage;
