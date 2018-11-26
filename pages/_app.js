import App, { Container } from 'next/app';
import Router from 'next/router';
import React from 'react';
import { Provider, connect } from 'react-redux';
import withReduxStore from '../lib/with-redux-store';
import { authenticate } from '../actions';
import { Status } from '../types';
import '../styles/index.css';

// css/sass bug workaround
Router.events.on('routeChangeComplete', () => {
  if (process.env.NODE_ENV !== 'production') {
    const els = document.querySelectorAll(
      'link[href*="/_next/static/css/styles.chunk.css"]'
    );
    const timestamp = new Date().valueOf();
    els[0].href = '/_next/static/css/styles.chunk.css?v=' + timestamp;
  }
});

class MyApp extends App {
  componentDidMount() {
    this.props.reduxStore.dispatch(authenticate);
  }
  render() {
    const { Component, pageProps, reduxStore } = this.props;
    return (
      <Container>
        <Provider store={reduxStore}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    );
  }
}

export default withReduxStore(MyApp);
