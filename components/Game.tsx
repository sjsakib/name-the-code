import React from 'react';
import { Status, GameProps, GameMethods } from '../types';
import CodePanelContainer from '../containers/CodePanelContainer';

export default class Game extends React.Component<
  GameProps & GameMethods,
  { currentAns?: string }
> {
  constructor(props: GameProps & GameMethods) {
    super(props);
    this.state = {};
    props.fetchList();
  }

  render() {
    const { status, options, message, submit, next } = this.props;
    const { currentAns } = this.state;
    if (status === Status.FETCHING_LIST) {
      return <div>Fetching List</div>;
    }

    if (status === Status.FETCHED_LIST) {
      return (
        <div>
          <p>Choose a preferred language</p>
          <select onChange={e => this.props.setPreferredLan(e.target.value)}>
            <option value="c++">C++</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
          <button
            onClick={() => {
              this.props.fetchCodes();
            }}>
            Continue
          </button>
        </div>
      );
    }
    return (
      <div>
        <CodePanelContainer />
        {options.map(op => (
          <div key={op.id}>
            <input
              type="radio"
              onChange={e => this.setState({ currentAns: e.target.value })}
              value={op.id}
              name="SelectionInput"
            />
            {op.name}
            <br />
          </div>
        ))}
        {message && <div>{message}</div>}
        {message === '' ? (
          currentAns && <button onClick={() => submit(currentAns)}>Submit</button>
        ) : (
          <button onClick={() => next()}>Next</button>
        )}
      </div>
    );
  }
}
