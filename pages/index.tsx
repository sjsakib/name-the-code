import React from 'react';
import { connect } from 'react-redux';
import { Dispatch, Action } from 'redux';
import Link from 'next/link';
import { State, HomeMethods, HomeProps } from '../types';
import { startUI } from '../actions';
import Loading from '../components/Loading';
import Decorator from '../components/Decorator';
import { Header, Button } from 'semantic-ui-react';
import 'firebaseui/dist/firebaseui.css';

class Page extends React.Component<HomeMethods & HomeProps> {
  componentDidUpdate() {
    this.startUI();
  }
  componentDidMount() {
    this.startUI();
  }
  startUI() {
    const { user, authenticating } = this.props;
    if (user === undefined && !authenticating) {
      this.props.startUI();
    }
  }
  render() {
    const { user, authenticating } = this.props;
    if (authenticating) return <Loading message="Authenticating" />;
    return (
      <Decorator active="home">
        <div className="heading">
          <Header as="h1" content="Name The Code" />
          {user ? (
            <Link href="/play">
              <Button as="a">Start Playing </Button>
            </Link>
          ) : (
            <div>Sign in to continue</div>
          )}
          <div id="firebaseui-auth-container" />
        </div>
      </Decorator>
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
