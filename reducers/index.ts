import { initialState } from '../store';
import { actionTypes } from '../actions';
import { RootAction, Status, State, defaultLan, optionCount } from '../types';
import shuffle from '../lib/shuffle';

export default (state: State = initialState, action: RootAction) => {
  switch (action.type) {
    case actionTypes.UPDATE_LIST:
      const data = action.data;
      const keys = Object.keys(data);
      const easy = shuffle(keys.filter(k => data[k].level === 'easy'));
      const medium = shuffle(keys.filter(k => data[k].level === 'medium'));
      const hard = shuffle(keys.filter(k => data[k].level === 'hard'));
      const list = easy.concat(medium).concat(hard);
      const currentAlgo = list[0];
      return {
        ...state,
        ...{
          data,
          list,
          score: 0,
          message: '',
          currentAns: '',
          currentAlgo,
          options: getOptions(list[0], list, optionCount),
          status: Status.FETCHED_LIST,
          currentLan: data[currentAlgo].codes[defaultLan]
            ? defaultLan
            : Object.keys(data[currentAlgo].codes)[0]
        }
      };
    case actionTypes.UPDATE_STATUS:
      return {
        ...state,
        ...{
          status: action.status
        }
      };
    case actionTypes.UPDATE_CODE:
      return {
        ...state,
        ...{
          codes: {
            ...state.codes,
            ...{
              [action.algo]: {
                ...state.codes[action.algo],
                ...{ [action.lan]: action.code }
              }
            }
          }
        }
      };
    case actionTypes.SET_PREFERRED_LAN:
      return {
        ...state,
        ...{
          preferredLan: action.lan,
          currentLan: state.data[state.currentAlgo].codes[action.lan]
            ? action.lan
            : state.data[state.currentAlgo].codes[defaultLan]
              ? defaultLan
              : Object.keys(state.data[state.currentAlgo].codes)[0]
        }
      };
    case actionTypes.CHANGE_LAN:
      return { ...state, ...{ currentLan: action.lan } };
    case actionTypes.UPDATE:
      return { ...state, ...action.updates };
    default:
      return state;
  }
};

// returns `n` number of options from `list` including `ans`
export function getOptions(ans: string, list: Array<string>, n: number) {
  const options = [ans];
  while (options.length !== n) {
    const i = Math.floor(Math.random() * list.length);
    if (!options.includes(list[i])) {
      options.push(list[i]);
    }
  }
  return shuffle(options);
}
