import { combineReducers, createStore, applyMiddleware, Reducer, Store } from "redux";
import createSagaMiddleware, { SagaMiddleware } from "redux-saga";

import rootSaga from "./sagas";
import postsState, { PostsState } from "./services/state/posts/posts.state";

export interface CombinedAppState {
  posts: PostsState
}

const rootReducer: Reducer = combineReducers({
  [postsState.name]: postsState.reducer
});

export const createAppStore = (): Store => {
  const sagaMiddleware: SagaMiddleware = createSagaMiddleware();
  const store: Store = createStore(
    rootReducer,
    applyMiddleware(sagaMiddleware)
  );

  sagaMiddleware.run(rootSaga)

  return store;
}
