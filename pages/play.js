import React from 'react';
import axios from 'axios';
import shuffle from '../lib/shuffle';

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 'LOADING',
      preferredLanguage: 'c++',
      codes: {}
    };
    this.fetchList();
  }

  fetchList() {
    axios.get('/static/list.json').then(res => {
      const data = res.data;
      this.data = data;
      const easy = shuffle(
        Object.keys(data).filter(k => data[k].level === 'easy')
      );
      const medium = shuffle(
        Object.keys(data).filter(k => data[k].level === 'medium')
      );
      const hard = shuffle(
        Object.keys(data).filter(k => data[k].level === 'hard')
      );
      this.list = easy.concat(medium).concat(hard);
    });
  }

  fetchCodes() {
    const data = this.data;
    this.list.forEach(id => {
      const lan = data[id][this.state.preferredLanguage] || 'c++';
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
            onChange={e => this.setState({ preferredLanguage: e.target.value })}
          >
            <option value="c++">C++</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
          <button
            onClick={() => {
              this.setState({ current: this.list[0] });
              this.fetchCodes();
            }}
          >
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
