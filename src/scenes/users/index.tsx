import { useEffect } from 'react';
import { connect } from 'react-redux';

import { CombinedAppState } from '../../store';

import UsersState, { User } from '../../services/state/users/users.state'

export interface Props {
  // state
  users: User[];
  pending: boolean;
  error: Error | null;

  // dispatch
  loadUsers: () => void;
}

const Users = ({ users, pending, error, loadUsers }: Props): JSX.Element => {
  useEffect((): void => {
    loadUsers();
  }, [loadUsers]);

  return (
    <>
      <h1>A list of users!</h1>
      {pending
        ? <p>Please wait...</p>
        : (
          <ul>
            {users.map(({ id, name }: User): JSX.Element => <li key={id}>{name}</li>)}
          </ul>
        )
      }
      {error && <p>There was an error</p>}
    </>
  );
}

const mapStateToProps = (state: CombinedAppState) => ({
  users: UsersState.selectors.getAllUsersFromState(state),
  pending: UsersState.selectors.getIsPending(state),
  error: UsersState.selectors.getError(state),
});

export const mapDispatchToProps = {
  loadUsers: UsersState.actions.loadUsersRequest,
};

const ConnectedUsers = connect(mapStateToProps, mapDispatchToProps)(Users);

export default ConnectedUsers;