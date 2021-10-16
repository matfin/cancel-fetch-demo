import {
  combineReducers,
  createStore,
  applyMiddleware,
  Reducer,
  Store,
} from 'redux';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';

import rootSaga from './sagas';
import postsState, { PostsState } from './services/state/posts/posts.state';
import photosState, { PhotosState } from './services/state/photos/photos.state';
import usersState, { UsersState } from './services/state/users/users.state';

export interface CombinedAppState {
  posts: PostsState;
  photos: PhotosState;
  users: UsersState;
}

const rootReducer: Reducer = combineReducers({
  [postsState.name]: postsState.reducer,
  [photosState.name]: photosState.reducer,
  [usersState.name]: usersState.reducer,
});

export const createAppStore = (): Store => {
  const sagaMiddleware: SagaMiddleware = createSagaMiddleware();
  const store: Store = createStore(
    rootReducer,
    applyMiddleware(sagaMiddleware)
  );

  sagaMiddleware.run(rootSaga);

  return store;
};
