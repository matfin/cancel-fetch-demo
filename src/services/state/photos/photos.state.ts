import { createSelector } from 'reselect';

// types

export type Photo = {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
};

export type Payload = {
  photos?: Photo[];
  error?: Error;
};

export type PhotosAction = {
  type: string;
  payload?: Payload;
  error?: Error;
};

export type PhotosState = {
  photos: Photo[];
  pending: boolean;
  error?: Error | null;
};

// constants
const reducerName = 'photos';
const FETCH_PHOTOS_REQUEST = `${reducerName}/FETCH_PHOTOS_REQUEST`;
const FETCH_PHOTOS_CANCEL = `${reducerName}/FETCH_PHOTOS_CANCEL`;
const FETCH_PHOTOS_SUCCESS = `${reducerName}/FETCH_PHOTOS_SUCCESS`;
const FETCH_PHOTOS_FAILURE = `${reducerName}/FETCH_PHOTOS_FAILURE`;

// actions
const loadPhotosRequest = (): PhotosAction => ({
  type: FETCH_PHOTOS_REQUEST,
});

const loadPhotosCancel = (): PhotosAction => ({
  type: FETCH_PHOTOS_CANCEL,
});

const loadPhotosSuccess = (photos: Photo[]): PhotosAction => ({
  type: FETCH_PHOTOS_SUCCESS,
  payload: { photos },
});

const loadPhotosFailure = (error: Error): PhotosAction => ({
  type: FETCH_PHOTOS_FAILURE,
  payload: { error },
});

// reducer
export const initialState: PhotosState = {
  photos: [],
  pending: false,
  error: null,
};

const reducer = (
  state: PhotosState = initialState,
  action: PhotosAction
): PhotosState => {
  const { type, payload, error } = action;

  switch (type) {
    case FETCH_PHOTOS_REQUEST: {
      return {
        ...state,
        pending: true,
        error: null,
      };
    }
    case FETCH_PHOTOS_SUCCESS: {
      return {
        ...state,
        pending: false,
        photos: payload?.photos ?? [],
        error: null,
      };
    }
    case FETCH_PHOTOS_FAILURE: {
      return {
        ...state,
        pending: false,
        error: error,
      };
    }
    default: {
      return state;
    }
  }
};

// selectors
const getPhotosState = ({ photos }: { photos: PhotosState }) => photos;
const getAllPhotosFromState = createSelector(
  getPhotosState,
  ({ photos }: PhotosState) => photos
);
const getIsPending = createSelector(
  getPhotosState,
  ({ pending }: PhotosState) => pending
);
const getError = createSelector(
  getPhotosState,
  ({ error }: PhotosState) => error
);

const photosState = {
  actions: {
    loadPhotosRequest,
    loadPhotosCancel,
    loadPhotosSuccess,
    loadPhotosFailure,
  },
  types: {
    FETCH_PHOTOS_REQUEST,
    FETCH_PHOTOS_CANCEL,
    FETCH_PHOTOS_SUCCESS,
    FETCH_PHOTOS_FAILURE,
  },
  selectors: {
    getAllPhotosFromState,
    getError,
    getIsPending,
  },
  name: reducerName,
  reducer,
};

export default photosState;
