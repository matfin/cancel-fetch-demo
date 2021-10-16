import { cancelled, take } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';

import { get } from 'services/state/network/api';

import photosState, { Photo } from './photos.state';
import rootSaga, { handleLoadPhotos } from './photos.saga';

jest.mock('services/state/network/api', () => ({
  get: jest.fn(),
}));

const mockState = {
  photos: {
    photos: [],
    pending: false,
    error: null,
  },
};

describe('photos saga', (): void => {
  afterEach((): void => {
    (get as jest.Mock).mockReset();
  });

  describe('root saga', (): void => {
    it('should run the root saga', (): void => {
      const gen = rootSaga();

      expect(gen.next().value).toEqual(
        take(photosState.types.FETCH_PHOTOS_REQUEST)
      );
      expect(gen.next().value).toEqual(0);
    });

    it('should cancel the fetch task', async (): Promise<void> => {
      await expectSaga(rootSaga)
        .withState(mockState)
        .take(photosState.types.FETCH_PHOTOS_REQUEST)
        .dispatch(photosState.actions.loadPhotosRequest())
        .fork(handleLoadPhotos)
        .dispatch(photosState.actions.loadPhotosCancel())
        .silentRun();
    });
  });

  describe('handleLoadPhotos', (): void => {
    it('should fetch photos with success', async (): Promise<void> => {
      (get as jest.Mock).mockResolvedValue([{ id: 1 }, { id: 2 }]);

      await expectSaga(rootSaga)
        .withState(mockState)
        .call.like({ fn: get })
        .put(
          photosState.actions.loadPhotosSuccess([
            { id: 1 } as Photo,
            { id: 2 } as Photo,
          ])
        )
        .dispatch(photosState.actions.loadPhotosRequest())
        .silentRun();
    });

    it('should fail to fetch photos', async (): Promise<void> => {
      const error: Error = new Error('oops');

      (get as jest.Mock).mockRejectedValue(error);

      await expectSaga(rootSaga)
        .withState(mockState)
        .call.like({ fn: get })
        .put(photosState.actions.loadPhotosFailure(error))
        .dispatch(photosState.actions.loadPhotosRequest())
        .silentRun();
    });

    it('should cancel fetching photos', async (): Promise<void> => {
      const spyAbort = jest.spyOn(AbortController.prototype, 'abort');
      const gen = handleLoadPhotos();

      gen.next();
      expect(gen.return(true).value).toEqual(cancelled());

      gen.next(true);
      expect(spyAbort).toHaveBeenCalledTimes(1);

      spyAbort.mockRestore();
    });
  });
});
