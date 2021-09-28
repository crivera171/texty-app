import React, {useState, useContext, useMemo} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {censoredPhone} from 'utils/phone';
import {useNavigation} from '@react-navigation/native';
import {COLORS} from 'Styles/colors';
import {Header} from '@/Components/Layout/Header';
import {Icon} from 'react-native-elements';
import {Menu} from '@/Components/Menu';
import {ContactStore} from 'State/ContactContext';
import {MessageStore} from 'State/MessageContext';

export const TitleBar = ({chatId}) => {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const {actions: contactActions} = useContext(ContactStore);
  const { state } = useContext(MessageStore);

  const currentChat = useMemo(() => {
    return state.chats.filter((chat) => chat.id === chatId)[0];
  }, [state.chats]);

  const isBanned = useMemo(() => currentChat.is_banned, []);

  return (
    <>
      <Header
        title={
          currentChat.contact.full_name ||
          censoredPhone(currentChat.contact_user.phone)
        }
        titleSize={18}
        handleBack={navigation.goBack}
        renderRightSide={
          <TouchableOpacity
            onPress={() => setMenuVisible(true)}
            style={styles.controls}>
            <Icon
              size={28}
              color={COLORS.lightGray}
              type="ionicon"
              name="ellipsis-horizontal"
            />
          </TouchableOpacity>
        }
      />
      <Menu
        isVisible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        title="Contact"
        actions={[
          {
            icon: isBanned ? 'mood' : 'block',
            name: `${isBanned ? 'Unblock' : 'Block'} ${
              currentChat.contact.full_name ||
              censoredPhone(currentChat.contact_user.phone)
            }`,
            color: isBanned ? COLORS.blue : COLORS.red,
            type: 'delete',
            last: true,
            onActionPress: () => {
              contactActions
                .banContact({
                  contact_id: currentChat.contact.id,
                  banned: !isBanned,
                });
              setMenuVisible(false);
            },
          },
        ]}
      />
    </>
  );
};

const styles = StyleSheet.create({
  controls: {
    width: 80,
    textAlign: 'center',
    justifyContent: 'center',
  },
});
