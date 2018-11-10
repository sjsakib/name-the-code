import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import CodePanel from '../components/CodePanel';
import { State, CodePanelProps, CodePanelMethods } from '../types';
import { changeLan } from '../actions';

const mapDispatchToProps = (dispatch: Dispatch<Action>): CodePanelMethods => ({
  changeLan: (lan: string) =>  dispatch(changeLan(lan))
});

const mapStateToProps = (state: State) : CodePanelProps => {
  const currentAlgo = state.currentAlgo;
  const current = state.codes[currentAlgo];
  const currentLan = state.currentLan;
  const availableLans = Object.keys(state.data[currentAlgo].codes);
  return {
    code:
      current !== undefined && current[currentLan] !== undefined
        ? current[currentLan]
        : '',
    availableLans,
    currentLan
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CodePanel);
