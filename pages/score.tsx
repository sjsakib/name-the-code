import * as React from 'react';
import { withRouter, SingletonRouter } from 'next/router';

class Score extends React.Component<{router: SingletonRouter}, {}> {
  render() {
    const  query  = this.props.router.query;
    const score = query ? query.score : 0;
    return <div>You scored {score} points</div>
  }
}

export default withRouter(Score);
