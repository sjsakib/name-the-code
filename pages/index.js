import React from 'react';
import Link from 'next/link';

class App extends React.Component {
  render() {
    return (
      <div>
        Hello World!
        <br />
        <Link href="/play">
          <a>start playing</a>
        </Link>
      </div>
    );
  }
}

export default App;
