import React from 'react';
import { Icon } from 'semantic-ui-react';

const Loading: React.SFC<{ message: string }> = ({ message }) => {
  return (
    <div className="loading-container">
      <Icon loading name="spinner" size="large" />
      {message && <span className="loading-message">{message}</span>}
    </div>
  );
};

export default Loading;
