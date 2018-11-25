import React from 'react';
import { connect } from 'react-redux';
import { Dispatch, Action } from 'redux';
import Link from 'next/link';
import { State, HomeMethods, HomeProps } from '../types';
import { startUI } from '../actions';
import 'firebaseui/dist/firebaseui.css';

class Page extends React.Component<HomeMethods & HomeProps> {
  componentDidUpdate() {
    const {user, authenticating} = this.props;
    if (user === undefined  && !authenticating) {
      this.props.startUI();
    }
  }
  render() {
    const { user, authenticating } = this.props;
    if (authenticating) return <div>Loading</div>;
    return (
      <div>
        {user ? (
          <>
            <Link href="/play">
              <a>start playing</a>
            </Link>
            <br />
            <Link href={'/score?uid=' + user.uid}>
              <a>score</a>
            </Link>
            <br />
          </>
        ) : (
          <div>Sign in to continue</div>
        )}
        <div id="firebaseui-auth-container" />
      </div>
    );
  }
}

const mapStateToProps = (state: State): HomeProps => {
  const { loadingUI, user, authenticating } = state;
  return { loadingUI, user, authenticating };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>): HomeMethods => ({
  startUI: () => dispatch(startUI)
});

export default connect(mapStateToProps, mapDispatchToProps)(Page);
