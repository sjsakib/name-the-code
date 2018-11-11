import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducers';
import { State, Status, defaultLan } from './types';

export const initialState: State = {
  currentAlgo: '',
  score: 0,
  life: 3,
  currentAns: '',
  message: '',
  status: Status.FETCHING_LIST,
  preferredLan: defaultLan,
  currentLan: defaultLan,
  codes: {},
  data: {},
  list: [],
  options: [],
  authenticating: true,
  loadingUI: true,
};


export function initializeStore(state: State = initialState) {
  return createStore(reducer, state, applyMiddleware(thunk));
}
