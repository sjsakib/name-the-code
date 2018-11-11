import axios from 'axios';
import { Dispatch, Action } from 'redux';
import Router from 'next/router';
import firebase from '../lib/firebase';
import { getOptions } from '../reducers';
import { State, defaultLan, Status } from '../types';

let firebaseui, ui: any;
if (typeof window !== 'undefined') {
  firebaseui = require('firebaseui');
  ui = new firebaseui.auth.AuthUI(firebase.auth());
}

export const actionTypes = {
  UPDATE_USER: 'UPDATE_USER',
  UPDATE_LIST: 'UPDATE_LIST',
  UPDATE_STATUS: 'UPDATE_STATUS',
  UPDATE_CODE: 'UPDATE_CODE',
  SET_PREFERRED_LAN: 'SET_PREFERRED_LAN',
  CHANGE_LAN: 'CHANGE_LAN',
  SUBMIT: 'SUBMIT',
  UPDATE: 'UPDATE'
};

export function fetchList(dispatch: Dispatch<Action>) {
  axios
    .get('/static/list.json')
    .then(res => {
      dispatch({ type: actionTypes.UPDATE_LIST, data: res.data });
    })
    .catch(e => {
      throw e;
    });
}

export function reset(_: any, getState: () => State) {
  const { user } = getState();
  firebase.firestore().collection('users').doc(user!.uid).update({
    passed: []
  });
}

export function fetchCodes(dispatch: Dispatch<Action>, getState: () => State) {
  const { data, list, preferredLan } = getState();
  list.forEach(id => {
    const lan = data[id].codes[preferredLan] ? preferredLan : defaultLan;
    axios
      .get('/static/' + data[id].codes[lan])
      .then(res => {
        dispatch({
          type: actionTypes.UPDATE_CODE,
          algo: id,
          lan,
          code: res.data
        });
        dispatch({
          type: actionTypes.UPDATE_STATUS,
          status: Status.FETCHING_CODES
        });
      })
      .catch(e => {
        throw e;
      });
  });
}

export function changeLan(lan: string) {
  return function(dispatch: Dispatch<Action>, getState: () => State) {
    dispatch({ type: actionTypes.CHANGE_LAN, lan });

    const { data, codes, currentAlgo } = getState();
    if (codes[currentAlgo][lan] === undefined) {
      axios
        .get('/static/' + data[currentAlgo].codes[lan])
        .then(res => {
          dispatch({
            type: actionTypes.UPDATE_CODE,
            algo: currentAlgo,
            lan,
            code: res.data
          });
        })
        .catch(e => {
          throw e;
        });
    }
  };
}

export function submit(ans: string) {
  return function(dispatch: Dispatch<Action>, getState: () => State) {
    let { score, life, currentAlgo, message, data, user } = getState();
    if (currentAlgo === ans) {
      score++;
      message = 'Right!';
      firebase
        .firestore()
        .collection('users')
        .doc(user!.uid)
        .update({
          passed: firebase.firestore.FieldValue.arrayUnion(data[ans].name)
        });
    } else {
      life--;
      message = 'Wrong!';
    }
    dispatch({
      type: actionTypes.UPDATE,
      updates: {
        score,
        life,
        message
      }
    });
  };
}

export function setPreferredLan(lan: string) {
  return { type: actionTypes.SET_PREFERRED_LAN, lan };
}

export function next(dispatch: Dispatch<Action>, getState: () => State) {
  const { list, currentAlgo, preferredLan, life, score, data } = getState();

  const currentIndex = list.indexOf(currentAlgo);
  if (currentIndex === list.length - 1 || life === 0) {
    Router.push({ pathname: '/score', query: { score } });
    return;
  }
  const newCurrentAlgo = list[currentIndex + 1];

  dispatch({
    type: actionTypes.UPDATE,
    updates: {
      currentAlgo: newCurrentAlgo,
      options: getOptions(newCurrentAlgo, list, 2),
      message: '',
      currentLan: data[currentAlgo].codes[preferredLan]
        ? preferredLan
        : defaultLan
    }
  });
}

export function authenticate(dispatch: Dispatch<Action>) {
  firebase.auth().onAuthStateChanged(async user => {
    if (user) {
      dispatch({
        type: actionTypes.UPDATE,
        updates: {
          user: {
            uid: user.uid,
            name: user.displayName,
            photo: user.photoURL
          }
        }
      });
      let githubId = '';
      const githubData = user.providerData.find(
        d => d !== null && d.providerId === 'github.com'
      );
      if (githubData) {
        githubId = (await axios.get(
          'https://api.github.com/user/' + githubData.uid
        )).data.login;
      }
      firebase
        .firestore()
        .collection('users')
        .doc(user.uid)
        .set(
          { name: user.displayName, photo: user.photoURL, githubId },
          { merge: true }
        );
    }
    dispatch({
      type: actionTypes.UPDATE,
      updates: { authenticating: false }
    });
  });
}

export function startUI(dispatch: Dispatch<Action>) {
  const uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: () => {
        // we don't want firebaseui to redirect after successful sign-in
        // So we return false
        return false;
      },
      uiShown: () => {
        // Sign-in UI finished loading
        dispatch({
          type: actionTypes.UPDATE,
          updates: { loadingUI: false }
        });
      }
    },
    signInFlow: 'popup',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID
    ]
  };
  ui.start('#firebaseui-auth-container', uiConfig);
}
