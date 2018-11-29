import React from 'react';
import { withRouter, SingletonRouter } from 'next/router';
import { CommonHead } from '../components/Header';
import firebase from '../lib/firebase';
import Decorator from '../components/Decorator';
import { Message, Image, Label } from 'semantic-ui-react';

interface Profile {
  name: string;
  photo: string;
  github?: string;
  passed: string[];
  time: number;
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
    const { name, photo, github, passed, time } = profile || ({} as Profile);
    let title: string;
    if (error) title = error;
    else
      title = `${name} scored ${
        passed ? passed.length : 0
      } playing Name The Code`;
    return (
      <Decorator>
        <CommonHead
          title={title + ' | Name The Code'}
          image={profile && photo}
          description={
            'Recognized codes: ' +
            passed.reverse().join(', ')
          }
        />
        {error ? (
          <Message error header={error} />
        ) : (
          <div className="profile">
            <Image src={photo} avatar size="small" />
            <h1>{name}</h1>
            {github && (
              <a href={'https://github.com/' + github}>
                <Label icon="github" color="black" content={github} />
              </a>
            )}
            <div className="row">
              <Label
                color="green"
                size="large"
                icon="flag checkered"
                content="SCORE"
                detail={passed ? passed.length : 'NaN'}
              />
              <Label
                color="violet"
                size="large"
                icon="hourglass outline"
                content="TIME"
                detail={
                  passed
                    ? [Math.floor(time / 60), time % 60]
                        .map(x => ('0' + x).slice(-2))
                        .join(':')
                    : 'NaN'
                }
              />
            </div>
            {passed && passed.map(algo => <li key={algo}>{algo}</li>)}
          </div>
        )}
      </Decorator>
    );
  }
}

export default withRouter(Score);
