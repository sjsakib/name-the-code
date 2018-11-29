import React from 'react';
import { Icon } from 'semantic-ui-react';
import { CommonHead } from '../components/Header'

const Loading: React.SFC<{ message: string }> = ({ message }) => {
  return (
    <div className="loading-container">
      <CommonHead />
      <Icon loading name="spinner" size="large" />
      {message && <span className="loading-message">{message}</span>}
    </div>
  );
};

export default Loading;
