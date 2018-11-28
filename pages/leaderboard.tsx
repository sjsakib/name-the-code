import React from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';
import Loading from '../components/Loading';
import Decorator from '../components/Decorator';
import firebase from '../lib/firebase';
import formatTime from '../lib/formatTime';
import { State, User } from '../types';
import { Table, Grid, Label } from 'semantic-ui-react';

interface Profile {
  id: string;
  name: string;
  photo: string;
  score: number;
  time: number;
}

interface LeaderboardState {
  users?: Profile[];
}

class Leaderboard extends React.Component<{ user?: User }, LeaderboardState> {
  state: LeaderboardState = {};

  componentDidMount() {
    firebase
      .firestore()
      .collection('leaderboard')
      .orderBy('score', 'desc')
      .orderBy('time', 'asc')
      .get()
      .then(res => {
        const users: Profile[] = [];
        res.forEach(doc => {
          users.push({ ...(doc.data() as Profile), ...{ id: doc.id } });
        });
        this.setState({ users });
      });
  }

  render() {
    const { users } = this.state;
    if (!users) return <Loading message="Fetching leader board" />;
    const { user } = this.props;
    const rows = users.map((u, i) => {
      const own = user && u.id === user.uid;
      return (
        <Table.Row positive={own} key={u.id}>
          <Table.Cell>{own ? <Label ribbon>{i+1} </Label> : i+1}</Table.Cell>
          <Table.Cell>
            <Link href={'/score?uid=' + u.id}>
              <a>{u.name}</a>
            </Link>
          </Table.Cell>
          <Table.Cell>{u.score}</Table.Cell>
          <Table.Cell>{formatTime(u.time)}</Table.Cell>
        </Table.Row>
      );
    });
    return (
      <Decorator active="leaderboard">
        <Grid stackable columns="2">
          <Grid.Row centered>
            <Grid.Column>
              <Table unstackable striped>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>#</Table.HeaderCell>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Score</Table.HeaderCell>
                    <Table.HeaderCell>Time</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>{rows}</Table.Body>
              </Table>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Decorator>
    );
  }
}

export default connect(({ user }: State) => ({ user }))(Leaderboard);
