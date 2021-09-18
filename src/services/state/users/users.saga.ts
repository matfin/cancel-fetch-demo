import { call, cancel, cancelled, fork, put, take } from "redux-saga/effects";

import Endpoints from "../../../endpoints";
import { get } from "../network/api";

import UsersState, { User } from "./users.state";

export function* handleLoadUsers(): Generator {
  const abortController: AbortController = new AbortController();

  try {
    const photos: User[] | any = yield call(get, { url: Endpoints.users, signal: abortController.signal });

    yield put(UsersState.actions.loadUsersSuccess(photos));
  } catch (error) {
    yield put(UsersState.actions.loadUsersFailure(error as Error));
  } finally {
    if (yield cancelled()) {
      abortController.abort();
    }
  }
}

function* rootSaga(): Generator {
  while(yield take(UsersState.types.FETCH_USERS_REQUEST)) {
    const fetchTask = yield fork(handleLoadUsers);

    yield take(UsersState.types.FETCH_USERS_CANCEL);
    yield cancel(fetchTask as any);
  }
}

export default rootSaga;
