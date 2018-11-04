import React from 'react';
import axios from 'axios';
import Router from 'next/router';
import SyntaxHighlighter from 'react-syntax-highlighter';
import shuffle from '../lib/shuffle';
import '../styles/index.scss';

interface State {
  status: Status;
  currentAlgo: string;
  preferredLan: string;
  options: Array<string>;
  currentAns: string;
  message: string;
  score: number;
  life: number;
  currentLan: string;
  codes: {
    [key: string]: { [key: string]: string };
  };
  data: {
    [key: string]: {
      level: string;
      name: string;
      codes: { [key: string]: string };
    };
  };
  list: Array<string>;
}

enum Status {
  FETCHING_LIST,
  FETCHED_LIST,
  FETCHING_CODES
}

const defaultLan = 'c++';

class Playground extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    console.log('constructor was called....')
    this.state = {
      currentAlgo: '',
      score: 0,
      life: 3,
      currentAns: '',
      message: '',
      status: Status.FETCHING_LIST,
      preferredLan: defaultLan,
      currentLan: defaultLan,
      codes: {},
      data: {},
      list: [],
      options: []
    };
    this.fetchList();
  }

  fetchList() {
    axios
      .get('/static/list.json')
      .then(res => {
        const data = res.data;
        const keys = Object.keys(data);
        const easy = shuffle(keys.filter(k => data[k].level === 'easy'));
        const medium = shuffle(keys.filter(k => data[k].level === 'medium'));
        const hard = shuffle(keys.filter(k => data[k].level === 'hard'));
        const list = easy.concat(medium).concat(hard);
        this.setState({
          data,
          list,
          currentAlgo: list[0],
          options: this.getOptions(list[0], list),
          status: Status.FETCHED_LIST
        });
      })
      .catch(e => {
        //console.log(e);
        // throw e;
      });
  }

  fetchCodes() {
    const data = this.state.data;
    this.state.list.forEach(id => {
      const preferredLan = this.state.preferredLan;
      const lan = data[id].codes[preferredLan] ? preferredLan : defaultLan;
      axios
        .get('/static/' + data[id].codes[lan])
        .then(res => {
          this.setState({
            codes: { ...this.state.codes, [id]: { [lan]: res.data } },
            status: Status.FETCHING_CODES
          });
        })
        .catch(e => {
          console.log(e);
          throw e;
        });
    });
  }

  fetchLan(lan: string) {
    const currentAlgo = this.state.currentAlgo;
    axios
      .get('/static/' + this.state.data[currentAlgo].codes[lan])
      .then(res => {
        this.setState({
          codes: {
            ...this.state.codes,
            [currentAlgo]: {
              ...this.state.codes[currentAlgo],
              [lan]: res.data
            }
          }
        });
      })
      .catch(e => {
        console.log(e);
        throw e;
      });
  }

  handlePreferredLan(lan: string) {
    this.setState({
      preferredLan: lan,
      currentLan: this.state.data[this.state.currentAlgo].codes[lan]
        ? lan
        : defaultLan
    });
  }

  handleLanChange(lan: string) {
    this.setState({ currentLan: lan });
    if (this.state.codes[this.state.currentAlgo][lan] === undefined)
      this.fetchLan(lan);
  }

  handleNext() {
    const list = this.state.list;
    const currentAlgo = this.state.currentAlgo;
    const preferredLan = this.state.preferredLan;

    const currentIndex = list.indexOf(currentAlgo);
    if (currentIndex === list.length - 1 || this.state.life === 0) {
      Router.push({ pathname: '/score', query: { score: this.state.score } });
      return;
    }
    const newCurrentAlgo = list[currentIndex + 1];
    this.setState({
      currentAlgo: newCurrentAlgo,
      options: this.getOptions(newCurrentAlgo, list),
      message: '',
      currentLan: this.state.data[currentAlgo].codes[preferredLan]
        ? preferredLan
        : defaultLan
    });
  }

  getOptions(ans: string, list: Array<string>) {
    const options = [ans];
    // TODO: increase to 5 later
    while (options.length !== 2) {
      const i = Math.floor(Math.random() * list.length);
      if (!options.includes(list[i])) {
        options.push(list[i]);
      }
    }
    return shuffle(options);
  }

  handleSubmit() {
    let { score, life } = this.state;
    let message: string;
    if (this.state.currentAlgo === this.state.currentAns) {
      score++;
      message = 'Right!';
    } else {
      life--;
      message = 'Wrong!';
    }
    this.setState({
      score,
      message,
      life
    });
  }

  render() {
    const status = this.state.status;
    if (status === Status.FETCHING_LIST) {
      return <div>Fetching List</div>;
    }

    const currentAlgo = this.state.currentAlgo;

    if (status === Status.FETCHED_LIST) {
      return (
        <div>
          <p>Choose a preferred language</p>
          <select onChange={e => this.handlePreferredLan(e.target.value)}>
            <option value="c++">C++</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
          <button
            onClick={() => {
              this.fetchCodes();
            }}>
            Continue
          </button>
        </div>
      );
    }

    const current = this.state.codes[currentAlgo];
    const currentLan = this.state.currentLan;
    const availableLans = Object.keys(this.state.data[currentAlgo].codes);
    return (
      <div>
        <select
          value={currentLan}
          onChange={e => this.handleLanChange(e.target.value)}>
          {availableLans.map(lan => (
            <option key={lan} value={lan}>
              {lan}
            </option>
          ))}
        </select>
        <div>
          {current && current[currentLan] ? (
            <div id="code">
              <SyntaxHighlighter language={currentLan}>
                {current[currentLan]}
              </SyntaxHighlighter>
            </div>
          ) : (
            'Loading Code...'
          )}
          {this.state.options.map(op => (
            <div key={op}>
              <input
                type="radio"
                onChange={e => this.setState({ currentAns: e.target.value })}
                value={op}
                name="SelectionInput"
              />
              {this.state.data[op].name}
              <br />
            </div>
          ))}
          {this.state.message && <div>{this.state.message}</div>}
          {this.state.message === '' ? (
            <button onClick={() => this.handleSubmit()}>Submit</button>
          ) : (
            <button onClick={() => this.handleNext()}>Next</button>
          )}
        </div>
      </div>
    );
  }
}

export default Playground;
