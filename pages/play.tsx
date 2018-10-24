import React from 'react';
import axios from 'axios';
import shuffle from '../lib/shuffle';

interface State {
  current: string;
  preferredLanguage: string;
  codes: {
    [key: string]: {code: string, lan: string};
  };
  data: { [key: string]: { level: string, name: string, codes: { [key: string]: string } } };
  list: Array<string>;
}

class Page extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      current: 'LOADING',
      preferredLanguage: 'c++',
      codes: {},
      data: {},
      list: []
    };
    this.fetchList();
  }

  fetchList() {
    axios.get('/static/list.json').then(res => {
      const data = res.data;
      const keys = Object.keys(data);
      const easy = shuffle(keys.filter(k => data[k].level === 'easy'));
      const medium = shuffle(keys.filter(k => data[k].level === 'medium'));
      const hard = shuffle(keys.filter(k => data[k].level === 'hard'));
      const list = easy.concat(medium).concat(hard);
      this.setState({ data, list });
    });
  }

  fetchCodes() {
    const data = this.state.data;
    this.state.list.forEach(id => {
      const preferredLanguage = this.state.preferredLanguage;
      const lan = data[id].codes[preferredLanguage] ? preferredLanguage : 'c++';
      axios.get('/static/' + data[id].codes[lan]).then(res => {
        this.setState({
          codes: { ...this.state.codes, [id]: { code: res.data, lan } }
        });
      });
    });
  }

  render() {
    if (this.state.current === 'LOADING') {
      return (
        <div>
          <p>Choose a preferred language</p>
          <select
            onChange={e =>
              this.setState({ preferredLanguage: e.target.value })
            }>
            <option value="c++">C++</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
          <button
            onClick={() => {
              this.setState({ current: this.state.list[0] });
              this.fetchCodes();
            }}>
            Continue
          </button>
        </div>
      );
    }
    const current = this.state.codes[this.state.current];
    if (current !== undefined) {
      return (
        <div>
          <pre>{current.code}</pre>
        </div>
      );
    }
    return <div>Loading...</div>;
  }
}

export default Page;
