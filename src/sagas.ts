import { all } from 'redux-saga/effects';

import postsSaga from './services/state/posts/posts.saga'

function* rootSaga(): Generator<unknown>{
  yield all([
    postsSaga()
  ]);
}

export default rootSaga;