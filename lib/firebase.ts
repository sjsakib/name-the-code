import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const config = {
  apiKey: 'AIzaSyAx4L1ikjfJokmZlnefIsaAJpbu6fTpsAM',
  authDomain: 'name-the-code.firebaseapp.com',
  databaseURL: 'https://name-the-code.firebaseio.com',
  projectId: 'name-the-code',
  storageBucket: 'name-the-code.appspot.com',
  messagingSenderId: '18084746318'
};

try {
  firebase.initializeApp(config);
} catch (e) {
  if (!/already exists/.test(e.message)) {
    console.error('Firebase initialization error', e.stack);
  }
}

const db = firebase.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);

export default firebase;
