import { all, call, put, takeLatest } from 'redux-saga/effects';

import Endpoints from '../../../endpoints';
import { get } from '../network/api'

import PostsState, { Post } from './posts.state'

export function* handleLoadPosts() {
  try {
    const posts: Post[] = yield call(get, { url: Endpoints.posts })

    yield put(PostsState.actions.loadPostsSuccess(posts));
  } catch(error) {
    yield put(PostsState.actions.loadPostsFailure(error as Error));
  } 
}

function* rootSaga() {
  yield all([
    takeLatest(PostsState.actions.loadPostsRequest, handleLoadPosts)
  ])
}

export default rootSaga;