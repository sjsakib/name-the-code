import React from 'react';
import { connect } from 'react-redux';
import { Dispatch, Action } from 'redux';
import Link from 'next/link';
import { State, HomeMethods, HomeProps } from '../types';
import { startUI } from '../actions';
import 'firebaseui/dist/firebaseui.css';

class Page extends React.Component<HomeMethods & HomeProps> {
  componentDidMount() {
    if (this.props.user === undefined) {
      this.props.startUI();
    }
  }
  render() {
    const { user } = this.props;
    return (
      <div>
        Hello World!
        <Link href="play">
          <a>start playing</a>
        </Link>
        <br />
        <div id="firebaseui-auth-container" />
        {user && <div>{user.name}</div>}
      </div>
    );
  }
}

const mapStateToProps = (state: State): HomeProps => {
  const { loadingUI, user } = state;
  return { loadingUI, user };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>): HomeMethods => ({
  startUI: () => dispatch(startUI)
});

export default connect(mapStateToProps, mapDispatchToProps)(Page);
