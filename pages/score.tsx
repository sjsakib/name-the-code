import React from 'react';
import { withRouter, SingletonRouter } from 'next/router';
import firebase from '../lib/firebase';
import Decorator from '../components/Decorator';
import { Message, Image, Icon } from 'semantic-ui-react';

interface Profile {
  name: string;
  photo: string;
  github?: string;
  passed: string[];
}

interface Props {
  profile?: Profile;
  error?: string;
}

class Score extends React.Component<Props & { router: SingletonRouter }> {
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
      throw e;
      error = 'Page not found!';
    }
    return { profile: profile && profile.data(), error };
  }

  render() {
    const { profile, error } = this.props;
    return (
      <Decorator>
        {error ? (
          <Message error header={error} />
        ) : (
          <div className="profile">
            <Image src={profile!.photo} avatar size="small" />
            <h1>{profile!.name}</h1>
            {profile!.github && (
              <a href={'https://github.com/' + profile!.github}>
                <Icon name="github" size="large" color="black"/>
              </a>
            )}
            <h1>{profile!.passed.length}</h1>
            {profile!.passed.map(algo => <li key={algo}>{algo}</li>)}
          </div>
        )}
      </Decorator>
    );
  }
}

export default withRouter(Score);
