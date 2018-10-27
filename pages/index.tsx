import React from 'react';
import Link from 'next/link';

class Page extends React.Component {
  render() {
    return (
      <div>
        Hello World!
        <Link href='play'>
          <a>start playing</a>
         </Link>
        <br />
      </div>
    );
  }
}

export default Page;
