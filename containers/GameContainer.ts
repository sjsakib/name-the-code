import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import Game from '../components/Game';
import { State, GameProps, GameMethods } from '../types';
import { fetchCodes, submit, next, setPreferredLan, fetchList } from '../actions';

const mapDispatchToProps = (dispatch: Dispatch<Action>): GameMethods => ({
  fetchList: () => dispatch(fetchList),

  fetchCodes: () => dispatch(fetchCodes),

  setPreferredLan: (lan: string) => dispatch(setPreferredLan(lan)),

  submit: ans => dispatch(submit(ans)),

  next: () => dispatch(next)
});

const mapStateToProps = (state: State): GameProps => {
  const { status, options, message, data } = state;
  return {
    status,
    message,
    options: options.map(op => ({ name: data[op].name, id: op }))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);
