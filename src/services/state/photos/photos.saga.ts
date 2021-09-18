import { call, cancel, cancelled, fork, put, take } from "redux-saga/effects";

import Endpoints from "../../../endpoints";
import { get } from "../network/api";

import PhotosState, { Photo } from "./photos.state";

export function* handleLoadPhotos(): Generator {
  const abortController: AbortController = new AbortController();

  try {
    const photos: Photo[] | any = yield call(get, { url: Endpoints.photos, signal: abortController.signal });

    yield put(PhotosState.actions.loadPhotosSuccess(photos));
  } catch (error) {
    yield put(PhotosState.actions.loadPhotosFailure(error as Error));
  } finally {
    if (yield cancelled()) {
      abortController.abort();
    }
  }
}

function* rootSaga(): Generator {
  while(yield take(PhotosState.types.FETCH_PHOTOS_REQUEST)) {
    const fetchTask = yield fork(handleLoadPhotos);

    yield take(PhotosState.types.FETCH_PHOTOS_CANCEL);
    yield cancel(fetchTask as any);
  }
}

export default rootSaga;
