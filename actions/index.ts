import axios from 'axios';
import { Dispatch, Action } from 'redux';
import Router from 'next/router';
import { getOptions } from '../reducers';
import { State, defaultLan, Status } from '../types';

export const actionTypes = {
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
  return { type: actionTypes.SUBMIT, ans };
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
