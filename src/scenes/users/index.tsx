import { useEffect } from "react";
import { connect } from "react-redux";

import { CombinedAppState } from "../../store";

import UsersState, { User } from "../../services/state/users/users.state";

export interface Props {
  // state
  users: User[];
  pending: boolean;
  error: Error | null;

  // dispatch
  cancelUsers: () => void;
  loadUsers: () => void;
}

const UserTile = ({ name }: { name: string }): JSX.Element => <li>{name}</li>;

const Users = ({
  users,
  pending,
  error,
  cancelUsers,
  loadUsers,
}: Props): JSX.Element => {
  useEffect((): (() => void) => {
    loadUsers();

    return (): void => cancelUsers();
  }, []);

  return (
    <>
      <h1>A list of users!</h1>
      {pending ? (
        <p>Please wait...</p>
      ) : (
        <ul>
          {users.map(
            ({ id, name }: User): JSX.Element => (
              <UserTile key={id} name={name} />
            )
          )}
        </ul>
      )}
      {error && <p>There was an error</p>}
    </>
  );
};

const mapStateToProps = (state: CombinedAppState) => ({
  users: UsersState.selectors.getAllUsersFromState(state),
  pending: UsersState.selectors.getIsPending(state),
  error: UsersState.selectors.getError(state),
});

export const mapDispatchToProps = {
  loadUsers: UsersState.actions.loadUsersRequest,
  cancelUsers: UsersState.actions.loadUsersCancel,
};

const ConnectedUsers = connect(mapStateToProps, mapDispatchToProps)(Users);

export default ConnectedUsers;
