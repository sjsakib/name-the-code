import React from 'react';
import { withRouter, SingletonRouter } from 'next/router';
import firebase from '../lib/firebase';

interface Profile {
  name: string;
  photo: string;
  github: string[];
  passed: string[];
}

interface Props {
  profile?: Profile;
  error?: string;
}

class Score extends React.Component<Props & { router: SingletonRouter}> {
  static async getInitialProps({ query }: { query: any }) {
    let profile, error;
    try {
      const uid = query.uid;
      profile = await firebase
        .firestore()
        .collection('users')
        .doc(uid)
        .get();
      if (!profile.exists) {
        error = 'Profile not found!';
      }
    } catch (e) {
      error = 'Page not found!';
    }
    return { profile: profile && profile.data(), error};
  }

  render() {
    const { profile, error } = this.props;
    if (error) {
      return <div>{error}</div>
    } else {
      return (
      <div>
        {profile!.name} - {profile!.passed.length}
        {profile!.passed.map( algo => <li>{algo}</li>)}
      </div>
    );
    }
  }
}

export default withRouter(Score);
