import { StrictEffect, Task } from '@redux-saga/types';
import { call, cancel, cancelled, fork, put, take } from 'redux-saga/effects';

import Endpoints from '../../../endpoints';
import { get } from '../network/api';

import UsersState, { User } from './users.state';

export function* handleLoadUsers(): Generator<StrictEffect> {
  const abortController: AbortController = new AbortController();

  try {
    const users: unknown = yield call(get, {
      url: Endpoints.users,
      signal: abortController.signal,
    });

    yield put(UsersState.actions.loadUsersSuccess(users as User[]));
  } catch (error) {
    yield put(UsersState.actions.loadUsersFailure(error as Error));
  } finally {
    if (yield cancelled()) {
      abortController.abort();
    }
  }
}

function* rootSaga(): Generator<StrictEffect, number, Task> {
  while (yield take(UsersState.types.FETCH_USERS_REQUEST)) {
    const fetchTask: Task = yield fork(handleLoadUsers);

    yield take(UsersState.types.FETCH_USERS_CANCEL);
    yield cancel(fetchTask);
  }

  return 0;
}

export default rootSaga;
