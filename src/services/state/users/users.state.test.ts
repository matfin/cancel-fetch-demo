import usersState, { initialState, User, UsersState } from './users.state';

describe('users.state', (): void => {
  describe('actions', (): void => {
    it('loadUsersRequest', (): void => {
      expect(usersState.actions.loadUsersRequest()).toEqual({
        type: usersState.types.FETCH_USERS_REQUEST,
      });
    });

    it('loadUsersCancel', (): void => {
      expect(usersState.actions.loadUsersCancel()).toEqual({
        type: usersState.types.FETCH_USERS_CANCEL,
      });
    });

    it('loadUsersSuccess', (): void => {
      expect(usersState.actions.loadUsersSuccess([])).toEqual({
        type: usersState.types.FETCH_USERS_SUCCESS,
        payload: {
          users: [],
        },
      });
    });

    it('loadUsersFailure', (): void => {
      const error = new Error('failed');

      expect(usersState.actions.loadUsersFailure(error)).toEqual({
        type: usersState.types.FETCH_USERS_FAILURE,
        payload: { error },
      });
    });
  });

  describe('reducer', (): void => {
    it('updates the reducer when requesting users', (): void => {
      const state: UsersState = usersState.reducer(undefined, {
        type: usersState.types.FETCH_USERS_REQUEST,
      });
      const expected: UsersState = {
        ...initialState,
        pending: true,
      };

      expect(state).toEqual(expected);
    });

    it('updates the reducer when fetching users was successful', (): void => {
      const users: User[] = [{} as User, {} as User];
      const state: UsersState = usersState.reducer(undefined, {
        type: usersState.types.FETCH_USERS_SUCCESS,
        payload: {
          users,
        },
      });
      const expected: UsersState = {
        ...initialState,
        pending: false,
        users,
      };

      expect(state).toEqual(expected);
    });

    it('updates the reducer when fetching users was successful but there are no users', (): void => {
      const state: UsersState = usersState.reducer(undefined, {
        type: usersState.types.FETCH_USERS_SUCCESS,
      });
      const expected: UsersState = {
        ...initialState,
        pending: false,
        users: [],
      };

      expect(state).toEqual(expected);
    });

    it('updates the reducer when there was an error requesting users', (): void => {
      const error = new Error('failed');
      const state: UsersState = usersState.reducer(undefined, {
        type: usersState.types.FETCH_USERS_FAILURE,
        error,
      });
      const expected: UsersState = {
        ...initialState,
        pending: false,
        error,
      };

      expect(state).toEqual(expected);
    });

    it('returns the default state', (): void => {
      expect(
        usersState.reducer(undefined, {
          type: 'SOMETHING_ELSE',
        })
      ).toEqual(initialState);
    });
  });

  describe('selectors', (): void => {
    const state: UsersState = {
      users: [{ id: 1 } as User, { id: 2 } as User],
      pending: false,
      error: null,
    };

    it('gets all users from the state', (): void => {
      expect(
        usersState.selectors.getAllUsersFromState({ users: state })
      ).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it('gets the pending state', (): void => {
      expect(usersState.selectors.getIsPending({ users: state })).toEqual(
        false
      );
    });

    it('gets the error', (): void => {
      expect(usersState.selectors.getError({ users: state })).toEqual(null);
    });
  });
});
