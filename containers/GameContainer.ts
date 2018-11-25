import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import Game from '../components/Game';
import { State, GameProps, GameMethods } from '../types';
import {
  fetchCodes,
  submit,
  next,
  setPreferredLan,
  fetchList,
  reset
} from '../actions';

const mapDispatchToProps = (dispatch: Dispatch<Action>): GameMethods => ({
  fetchList: () => dispatch(fetchList),

  reset: () => dispatch(reset),

  fetchCodes: () => dispatch(fetchCodes),

  setPreferredLan: (lan: string) => dispatch(setPreferredLan(lan)),

  submit: ans => dispatch(submit(ans)),

  next: () => dispatch(next)
});

const mapStateToProps = (state: State): GameProps => {
  const { status, options, message, data, user, authenticating } = state;
  return {
    status,
    message,
    user,
    authenticating,
    options: options.map(op => ({ name: data[op].name, id: op }))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);
