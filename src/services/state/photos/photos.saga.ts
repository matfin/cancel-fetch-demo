import { all, call, put, takeLatest } from "redux-saga/effects";

import Endpoints from "../../../endpoints";
import { get } from "../network/api";

import PhotosState, { Photo } from "./photos.state";

export function* handleLoadPhotos() {
  try {
    const photos: Photo[] = yield call(get, { url: Endpoints.photos });

    yield put(PhotosState.actions.loadPhotosSuccess(photos));
  } catch (error) {
    yield put(PhotosState.actions.loadPhotosFailure(error as Error));
  }
}

function* rootSaga() {
  yield all([
    takeLatest(PhotosState.types.FETCH_PHOTOS_REQUEST, handleLoadPhotos),
  ]);
}

export default rootSaga;
