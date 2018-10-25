import React from 'react';
import axios from 'axios';
import shuffle from '../lib/shuffle';

interface State {
  currentAlgo: string;
  status: Status;
  preferredLan: string;
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

class Page extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      currentAlgo: '',
      status: Status.FETCHING_LIST,
      preferredLan: defaultLan,
      currentLan: defaultLan,
      codes: {},
      data: {},
      list: []
    };
    console.log(process);
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
          <select
            onChange={e => {
              const lan = e.target.value;
              this.setState({
                preferredLan: lan,
                currentLan: this.state.data[currentAlgo].codes[lan]
                  ? lan
                  : defaultLan
              });
            }}>
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
    const preferredLan = this.state.preferredLan;
    const currentLan = this.state.currentLan;
    const availableLans = Object.keys(this.state.data[currentAlgo].codes);
    const list = this.state.list;
    return (
      <div>
        <select
          value={currentLan}
          onChange={e => {
            const lan = e.target.value;
            this.setState({ currentLan: lan });
            if (current[lan] === undefined) this.fetchLan(lan);
          }}>
          {availableLans.map(lan => (
            <option key={lan} value={lan}>
              {lan}
            </option>
          ))}
        </select>
        <div>
          {current && current[currentLan] ? (
            <>
              <pre>{current[currentLan]}</pre>
              <button
                onClick={() =>
                  this.setState({
                    currentAlgo: list[list.indexOf(currentAlgo) + 1],
                    currentLan: this.state.data[currentAlgo].codes[preferredLan]
                      ? preferredLan
                      : defaultLan
                  })
                }>
                Next
              </button>
            </>
          ) : (
            <div>Loading Code...</div>
          )}
        </div>
      </div>
    );
  }
}

export default Page;
