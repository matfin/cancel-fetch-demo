import { all } from 'redux-saga/effects';

import postsSaga from './services/state/posts/posts.saga';
import photosSaga from './services/state/photos/photos.saga';
import usersSaga from './services/state/users/users.saga';

function* rootSaga(): Generator<unknown> {
  yield all([postsSaga(), photosSaga(), usersSaga()]);
}

export default rootSaga;
