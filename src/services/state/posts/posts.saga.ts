import { call, cancel, cancelled, fork, put, take } from "redux-saga/effects";

import Endpoints from "../../../endpoints";
import { get } from "../network/api";

import PostsState, { Post } from "./posts.state";

export function* handleLoadPosts(): Generator {
  const abortController: AbortController = new AbortController();

  try {
    const posts: Post[] | any = yield call(get, {
      url: Endpoints.posts,
      signal: abortController.signal,
    });

    yield put(PostsState.actions.loadPostsSuccess(posts));
  } catch (error) {
    yield put(PostsState.actions.loadPostsFailure(error as Error));
  } finally {
    if (yield cancelled()) {
      abortController.abort();
    }
  }
}

function* rootSaga (): Generator {
  while(yield take(PostsState.types.FETCH_POSTS_REQUEST)) {
    const fetchTask = yield fork(handleLoadPosts);

    yield take(PostsState.types.FETCH_POSTS_CANCEL);
    yield cancel(fetchTask as any);
  }
}

export default rootSaga;
