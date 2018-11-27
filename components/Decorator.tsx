import * as React from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';
import { User, State } from '../types';
import firebase from '../lib/firebase';
import { Container, Menu, Image, Dropdown } from 'semantic-ui-react';

class Decorator extends React.Component<{
  user?: User;
  active?: 'home' | 'leaderboard';
}> {
  render() {
    const { user, children, active } = this.props;
    return (
      <Container>
        <Menu borderless>
          <Link href="/">
            <Menu.Item active={active === 'home'} as="a">
              Home
            </Menu.Item>
          </Link>
          <Link href="/leaderboard">
            <Menu.Item as="a" active={active === 'leaderboard'}>
              Leader Board
            </Menu.Item>
          </Link>
          {user && (
            <Menu.Menu position="right">
              <Menu.Item>
                <Dropdown
                  pointing="top right"
                  icon={null}
                  trigger={<Image src={user.photo} avatar />}>
                  <Dropdown.Menu>
                    <Dropdown.Item>
                      <Link href={'/score?uid=' + user.uid}>
                        <a>{user.name}</a>
                      </Link>
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => firebase.auth().signOut()}>
                      Sign Out
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Menu.Item>
            </Menu.Menu>
          )}
        </Menu>
        {children}
      </Container>
    );
  }
}

const mapStateToProps = ({ user }: State) => ({ user });

export default connect(mapStateToProps)(Decorator);
