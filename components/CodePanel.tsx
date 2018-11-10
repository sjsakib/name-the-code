import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { CodePanelProps, CodePanelMethods } from '../types';

export default class GamePanel extends React.Component<CodePanelProps & CodePanelMethods> {
  render() {
    const { code, availableLans, currentLan } = this.props;
    return (
      <div>
        <select
          value={currentLan}
          onChange={e => this.props.changeLan(e.target.value)}>
          {availableLans.map(lan => (
            <option key={lan} value={lan}>
              {lan}
            </option>
          ))}
        </select>
        <div>
          {code !== '' ? (
            <div id="code">
              <SyntaxHighlighter language={currentLan}>
                {code}
              </SyntaxHighlighter>
            </div>
          ) : (
            'Loading Code...'
          )}
        </div>
      </div>
    );
  }
}
