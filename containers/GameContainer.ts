import { connect } from 'react-redux';
import Game from '../components/Game';
import { State, GameProps, GameMethods } from '../types';
import {
  fetchCodes,
  submit,
  next,
  setPreferredLan,
  fetchList,
  reset,
  changeLan
} from '../actions';

const mapDispatchToProps = (dispatch: any): GameMethods => ({
  changeLan: (lan: string) => dispatch(changeLan(lan)),

  fetchList: () => dispatch(fetchList),

  reset: () => dispatch(reset),

  fetchCodes: () => dispatch(fetchCodes),

  setPreferredLan: (lan: string) => dispatch(setPreferredLan(lan)),

  submit: ans => dispatch(submit(ans)),

  next: () => dispatch(next)
});

const mapStateToProps = (state: State): GameProps => {
  const {
    status,
    options,
    message,
    data,
    user,
    authenticating,
    preferredLan,
    currentLan,
    currentAlgo
  } = state;
  const current = state.codes[currentAlgo];
  return {
    status,
    message,
    user,
    authenticating,
    preferredLan,
    currentLan,
    options: options.map(op => ({ name: data[op].name, id: op })),
    currentLanOptions: data[currentAlgo] && Object.keys(data[currentAlgo].codes).map(lan => ({
      text: lan,
      value: lan
    })),
    code:
      current !== undefined && current[currentLan] !== undefined
        ? current[currentLan]
        : ''
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);
