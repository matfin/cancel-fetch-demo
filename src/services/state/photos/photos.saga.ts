import { StrictEffect, Task } from '@redux-saga/types';
import { call, cancel, cancelled, fork, put, take } from 'redux-saga/effects';

import Endpoints from 'endpoints';
import { get } from 'services/state/network/api';

import PhotosState, { Photo } from './photos.state';

export function* handleLoadPhotos(): Generator<StrictEffect> {
  const abortController: AbortController = new AbortController();

  try {
    const photos: unknown = yield call(get, {
      url: Endpoints.photos,
      signal: abortController.signal,
    });

    yield put(PhotosState.actions.loadPhotosSuccess(photos as Photo[]));
  } catch (error) {
    yield put(PhotosState.actions.loadPhotosFailure(error as Error));
  } finally {
    if (yield cancelled()) {
      abortController.abort();
    }
  }
}

function* rootSaga(): Generator<StrictEffect, number, Task> {
  while (yield take(PhotosState.types.FETCH_PHOTOS_REQUEST)) {
    const fetchTask = yield fork(handleLoadPhotos);

    yield take(PhotosState.types.FETCH_PHOTOS_CANCEL);
    yield cancel(fetchTask);
  }

  return 0;
}

export default rootSaga;
