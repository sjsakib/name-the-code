import React from 'react';
import Router from 'next/router';
import { Status, GameProps, GameMethods } from '../types';
import Loading from '../components/Loading';
import { Dropdown, Button, Grid } from 'semantic-ui-react';
import SyntaxHighlighter from 'react-syntax-highlighter';

export default class Game extends React.Component<
  GameProps & GameMethods,
  { currentAns?: string }
> {
  constructor(props: GameProps & GameMethods) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (this.props.user === undefined) {
      Router.push({ pathname: '/' });
    }
    this.props.fetchList();
  }

  render() {
    const {
      status,
      options,
      message,
      submit,
      next,
      authenticating,
      preferredLan,
      currentLan,
      currentLanOptions,
      code
    } = this.props;
    const { currentAns } = this.state;
    if (authenticating) return <Loading message="Authenticating" />;

    if (status === Status.FETCHING_LIST) {
      return <Loading message="Fetching list" />;
    }

    const lanOptions = [
      { text: 'C++', value: 'cpp' },
      { text: 'Java', value: 'java' },
      { text: 'Python', value: 'py' }
    ];

    if (status === Status.FETCHED_LIST) {
      return (
        <div className="lan-chooser">
          <h3>Choose a preferred language</h3>
          <Dropdown
            selection
            options={lanOptions}
            onChange={(e, v) => this.props.setPreferredLan(v.value as string)}
            defaultValue={preferredLan}
          />
          <Button
            className="start-button"
            onClick={() => {
              this.props.fetchCodes();
              this.props.reset();
            }}>
            Start
          </Button>
          <p>
            <small>**Will reset previous score</small>
          </p>
        </div>
      );
    }
    return (
      <div className="grid">
        <div className="code-panel">
          <div id="code">
            {code !== '' ? (
              <div>
                <SyntaxHighlighter language={currentLan}>
                  {code}
                </SyntaxHighlighter>
              </div>
            ) : (
              'Loading Code...'
            )}
          </div>
        </div>
        <div className="game">
          <Dropdown
            selection
            options={currentLanOptions}
            defaultValue={currentLan}
            onChange={(e, v) => this.props.changeLan(v.value as string)}
          />
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
            currentAns && (
              <Button onClick={() => submit(currentAns)}>Submit</Button>
            )
          ) : (
            <button onClick={() => next()}>Next</button>
          )}
        </div>
      </div>
    );
  }
}
