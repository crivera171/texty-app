import React, {useMemo} from 'react';
import {ListItem, Icon} from 'react-native-elements';
import {StyleSheet, View, Text} from 'react-native';
import {format} from 'date-fns';
import {COLORS} from 'Styles/colors.js';
import {Typography, Containers} from '../../../../../Styles';
import {censoredPhone} from '@/utils/phone';
import tw from 'tw';

const censoredPhoneOrName = (contact, contact_user) => {
  if (!contact) {
    return 'Anonymous';
  }
  if (contact.full_name) {
    return contact.full_name;
  }

  if (contact_user) {
    return censoredPhone(contact_user.phone);
  }
  return 'Anonymous';
};

const placeholder_message = {
  placeholder: true,
};

// captures media url and preceding colon
const embedRegexp = /:(\s)+https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;

export const ChatListComponent = ({chat, toMessages, isRead}) => {
  const message = useMemo(
    () => (chat.last_message ? chat.last_message : placeholder_message),
    [chat],
  );

  const maskedText = useMemo(() => {
    if (message.placeholder) {
      return '';
    }

    if (message.media_url) {
      if (message.media_type.includes('image')) {
        return '🖼 Sent an image';
      }
      return '🖇 Sent an attachment';
    }

    if (message.text.match(embedRegexp)) {
      return message.text.replace(embedRegexp, '');
    }

    return message.text;
  }, [message]);

  return (
    <ListItem
      underlayColor={COLORS.lightGray}
      onPress={toMessages}
      bottomDivider
      containerStyle={styles.listItemContainer}>
      <ListItem.Content>
        <View>
          <View style={styles.listItemTopRow}>
            <View style={styles.contactWrapper}>
              <Text style={styles.contact}>
                {censoredPhoneOrName(chat.contact, chat.contact_user)}
              </Text>
              {!isRead ? <View style={styles.unreadDot} /> : null}
            </View>
            {!message.placeholder ? (
              <Text style={styles.time} note>
                {format(message.timestamp, 'M/dd/yy')}
              </Text>
            ) : null}
          </View>
          {chat.order ? (
            <View style={styles.alertWrapper}>
              <Icon
                type="material-community"
                name="alert-circle-outline"
                size={20}
                color={COLORS.blue}
              />
              <Text style={styles.alertMessage} note numberOfLines={1}>
                Open Order
              </Text>
            </View>
          ) : message.placeholder ? (
            <Text
              style={[styles.message, {color: COLORS.darkGray}]}
              note
              numberOfLines={1}>
              No messages in this chat yet
            </Text>
          ) : (
            <Text style={styles.message} note numberOfLines={1}>
              <Text style={styles.sender}>
                {message.direction === 'from_influencer' && 'You: '}
              </Text>
              {maskedText}
            </Text>
          )}
        </View>
      </ListItem.Content>
    </ListItem>
  );
};

const styles = StyleSheet.create({
  listItemContainer: {
    ...Containers.container,
    ...tw('py-3'),
  },
  listItemTopRow: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  unanswered: {
    fontWeight: 'bold',
  },
  contactWrapper: tw('flex-row items-center'),
  contact: {
    ...Typography.title,
    ...tw('capitalize'),
  },
  message: {
    ...Typography.subtitle,
    ...tw('mt-2'),
  },
  sender: {
    ...Typography.subtitle,
    ...tw('font-bold'),
  },
  time: {
    color: COLORS.darkGray,
  },
  alertMessage: {
    ...Typography.subtitle,
    ...tw('text-blue ml-2'),
  },
  alertWrapper: tw('flex-row mt-2 items-center'),
  unreadDot: {
    backgroundColor: COLORS.blue,
    width: 10,
    height: 10,
    borderRadius: 15,
    marginLeft: 8,
  },
});
