import { all, call, put, takeLatest } from "redux-saga/effects";

import Endpoints from "../../../endpoints";
import { get } from "../network/api";

import UsersState, { User } from "./users.state";

export function* handleLoadUsers() {
  try {
    const photos: User[] = yield call(get, { url: Endpoints.users });

    yield put(UsersState.actions.loadUsersSuccess(photos));
  } catch (error) {
    yield put(UsersState.actions.loadUsersFailure(error as Error));
  }
}

function* rootSaga() {
  yield all([
    takeLatest(UsersState.types.FETCH_USERS_REQUEST, handleLoadUsers),
  ]);
}

export default rootSaga;
