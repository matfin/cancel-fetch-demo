import { cancelled, take } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';

import { get } from 'services/state/network/api';

import usersState, { User } from './users.state';
import rootSaga, { handleLoadUsers } from './users.saga';

jest.mock('services/state/network/api', () => ({
  get: jest.fn(),
}));

const mockState = {
  users: {
    users: [],
    pending: false,
    error: null,
  },
};

describe('users saga', (): void => {
  afterEach((): void => {
    (get as jest.Mock).mockReset();
  });

  describe('root saga', (): void => {
    it('should run the root saga', (): void => {
      const gen = rootSaga();

      expect(gen.next().value).toEqual(
        take(usersState.types.FETCH_USERS_REQUEST)
      );
      expect(gen.next().value).toEqual(0);
    });

    it('should cancel the fetch task', async (): Promise<void> => {
      await expectSaga(rootSaga)
        .withState(mockState)
        .take(usersState.types.FETCH_USERS_REQUEST)
        .dispatch(usersState.actions.loadUsersRequest())
        .fork(handleLoadUsers)
        .dispatch(usersState.actions.loadUsersCancel())
        .silentRun();
    });
  });

  describe('handleLoadUsers', (): void => {
    it('should fetch users with success', async (): Promise<void> => {
      (get as jest.Mock).mockResolvedValue([{ id: 1 }, { id: 2 }]);

      await expectSaga(rootSaga)
        .withState(mockState)
        .call.like({ fn: get })
        .put(
          usersState.actions.loadUsersSuccess([
            { id: 1 } as User,
            { id: 2 } as User,
          ])
        )
        .dispatch(usersState.actions.loadUsersRequest())
        .silentRun();
    });

    it('should fail to fetch users', async (): Promise<void> => {
      const error: Error = new Error('oops');

      (get as jest.Mock).mockRejectedValue(error);

      await expectSaga(rootSaga)
        .withState(mockState)
        .call.like({ fn: get })
        .put(usersState.actions.loadUsersFailure(error))
        .dispatch(usersState.actions.loadUsersRequest())
        .silentRun();
    });

    it('should cancel fetching users', async (): Promise<void> => {
      const spyAbort = jest.spyOn(AbortController.prototype, 'abort');
      const gen = handleLoadUsers();

      gen.next();
      expect(gen.return(true).value).toEqual(cancelled());

      gen.next(true);
      expect(spyAbort).toHaveBeenCalledTimes(1);

      spyAbort.mockRestore();
    });
  });
});
