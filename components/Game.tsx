import React from 'react';
import Router from 'next/router';
import { Status, GameProps, GameMethods } from '../types';
import Loading from '../components/Loading';
import { Dropdown, Button, Label, Message, Checkbox } from 'semantic-ui-react';
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
      code,
      life,
      score,
      time,
      currentAns,
      updateAns
    } = this.props;
    
    if (authenticating) return <Loading message="Authenticating" />;

    if (status === Status.FETCHING_LIST) {
      return <Loading message="Fetching list" />;
    }

    const lanOptions = [
      { text: 'C++', value: 'cpp' },
      { text: 'Java', value: 'java' },
      { text: 'Python', value: 'python' }
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
              <Loading message="Fetching Code" />
            )}
          </div>
        </div>
        <div className="game">
          <div>
            <div className="row">
              <Label
                color="green"
                icon="flag checkered"
                content="SCORE"
                size="big"
                detail={score}
              />
            </div>
            <div className="row">
              <Label
                color="red"
                size="large"
                icon="heart outline"
                content="LIFE"
                detail={life}
              />
              <Label
                color="violet"
                size="large"
                icon="hourglass outline"
                content="TIME"
                detail={time}
              />
            </div>
            <div className="row">
              <Dropdown
                selection
                options={currentLanOptions}
                value={currentLan}
                onChange={(e, v) => this.props.changeLan(v.value as string)}
              />
            </div>
            {options.map(op => (
              <Checkbox
                className="ans-option"
                label={op.name}
                key={op.id}
                checked={currentAns === op.id}
                onClick={() => updateAns(op.id)}
              />
            ))}
            <div className="row">
              {message === '' ? (
                currentAns && (
                  <Button onClick={() => submit(currentAns)}>Submit</Button>
                )
              ) : (
                <Button onClick={() => next()}>Next</Button>
              )}
            </div>
            {message && (
              <div className="row">
                <Message
                  header={message}
                  success={message === 'Right!'}
                  error={message === 'Wrong!'}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
