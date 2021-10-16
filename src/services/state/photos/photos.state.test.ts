import photosState, { initialState, Photo, PhotosState } from './photos.state';

describe('photos.state', (): void => {
  describe('actions', (): void => {
    it('loadPhotosRequest', (): void => {
      expect(photosState.actions.loadPhotosRequest()).toEqual({
        type: photosState.types.FETCH_PHOTOS_REQUEST,
      });
    });

    it('loadPhotosCancel', (): void => {
      expect(photosState.actions.loadPhotosCancel()).toEqual({
        type: photosState.types.FETCH_PHOTOS_CANCEL,
      });
    });

    it('loadPhotosSuccess', (): void => {
      expect(photosState.actions.loadPhotosSuccess([])).toEqual({
        type: photosState.types.FETCH_PHOTOS_SUCCESS,
        payload: {
          photos: [],
        },
      });
    });

    it('loadPhotosFailure', (): void => {
      const error = new Error('failed');

      expect(photosState.actions.loadPhotosFailure(error)).toEqual({
        type: photosState.types.FETCH_PHOTOS_FAILURE,
        payload: { error },
      });
    });
  });

  describe('reducer', (): void => {
    it('updates the reducer when requesting photos', (): void => {
      const state: PhotosState = photosState.reducer(undefined, {
        type: photosState.types.FETCH_PHOTOS_REQUEST,
      });
      const expected: PhotosState = {
        ...initialState,
        pending: true,
      };

      expect(state).toEqual(expected);
    });

    it('updates the reducer when fetching photos was successful', (): void => {
      const photos: Photo[] = [{} as Photo, {} as Photo];
      const state: PhotosState = photosState.reducer(undefined, {
        type: photosState.types.FETCH_PHOTOS_SUCCESS,
        payload: {
          photos,
        },
      });
      const expected: PhotosState = {
        ...initialState,
        pending: false,
        photos,
      };

      expect(state).toEqual(expected);
    });

    it('updates the reducer when fetching photos was successful but there are no photos', (): void => {
      const state: PhotosState = photosState.reducer(undefined, {
        type: photosState.types.FETCH_PHOTOS_SUCCESS,
      });
      const expected: PhotosState = {
        ...initialState,
        pending: false,
        photos: [],
      };

      expect(state).toEqual(expected);
    });

    it('updates the reducer when there was an error requesting photos', (): void => {
      const error = new Error('failed');
      const state: PhotosState = photosState.reducer(undefined, {
        type: photosState.types.FETCH_PHOTOS_FAILURE,
        error,
      });
      const expected: PhotosState = {
        ...initialState,
        pending: false,
        error,
      };

      expect(state).toEqual(expected);
    });

    it('returns the default state', (): void => {
      expect(
        photosState.reducer(undefined, {
          type: 'SOMETHING_ELSE',
        })
      ).toEqual(initialState);
    });
  });

  describe('selectors', (): void => {
    const state: PhotosState = {
      photos: [{ id: 1 } as Photo, { id: 2 } as Photo],
      pending: false,
      error: null,
    };

    it('gets all photos from the state', (): void => {
      expect(
        photosState.selectors.getAllPhotosFromState({ photos: state })
      ).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it('gets the pending state', (): void => {
      expect(photosState.selectors.getIsPending({ photos: state })).toEqual(
        false
      );
    });

    it('gets the error', (): void => {
      expect(photosState.selectors.getError({ photos: state })).toEqual(null);
    });
  });
});
