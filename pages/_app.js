import App, { Container } from 'next/app';
import React from 'react';
import { Provider, connect } from 'react-redux';
import withReduxStore from '../lib/with-redux-store';
import { authenticate } from '../actions';
import { Status } from '../types';

class MyApp extends App {
  componentDidMount() {
    this.props.reduxStore.dispatch(authenticate);
  }
  render() {
    const { Component, pageProps, reduxStore } = this.props;
    return (
      <Container>
        <Provider store={reduxStore}>
          <ComponentContainer>
            <Component {...pageProps} />
          </ComponentContainer>
        </Provider>
      </Container>
    );
  }
}

const ComponentContainer = connect(({ authenticating }) => ({ authenticating }))(
  (props) =>
    (props.authenticating ? <div>Loading</div> : props.children)
);

export default withReduxStore(MyApp);
