import firebase from 'firebase';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyA5iIuV9e-1EUpU5C6RKdUkhRveNuHctcw',
  authDomain: 'smsapp-ddf7a.firebaseapp.com',
  databaseURL: 'https://smsapp-ddf7a.firebaseio.com',
  projectId: 'smsapp-ddf7a',
  storageBucket: 'smsapp-ddf7a.appspot.com',
  messagingSenderId: '465509191918',
  appId: '1:465509191918:web:46a4557d945233acfbe3ff',
  measurementId: 'G-329MD4KVJX',
};
// Initialize Firebase

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const getUrlFromFile = async (uri, fileName) => {
  const resp = await fetch(uri);
  const blob = await resp.blob();
  const ref = firebase.storage().ref(`/profileUploads/${fileName}`);
  await ref.put(blob);
  return ref.getDownloadURL();
};
