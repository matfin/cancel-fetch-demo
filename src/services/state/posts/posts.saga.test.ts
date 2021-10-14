import { cancelled, take } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';

import { get } from 'services/state/network/api';

import postsState, { Post } from './posts.state';
import rootSaga, { handleLoadPosts } from './posts.saga';

jest.mock('services/state/network/api', () => ({
  get: jest.fn(),
}));

const mockState = {
  posts: {
    posts: [],
    pending: false,
    error: null,
  },
};

describe('posts saga', (): void => {
  afterEach((): void => {
    (get as jest.Mock).mockReset();
  });

  describe('root saga', (): void => {
    it('should run the root saga', (): void => {
      const gen = rootSaga();

      expect(gen.next().value).toEqual(
        take(postsState.types.FETCH_POSTS_REQUEST)
      );
      expect(gen.next().value).toEqual(0);
    });

    it('should cancel the fetch task', async (): Promise<void> => {
      await expectSaga(rootSaga)
        .withState(mockState)
        .take(postsState.types.FETCH_POSTS_REQUEST)
        .dispatch(postsState.actions.loadPostsRequest())
        .fork(handleLoadPosts)
        .dispatch(postsState.actions.loadPostsCancel())
        .silentRun();
    });
  });

  describe('handleLoadPosts', (): void => {
    it('should fetch posts with success', async (): Promise<void> => {
      (get as jest.Mock).mockResolvedValue([{ id: 1 }, { id: 2 }]);

      await expectSaga(rootSaga)
        .withState(mockState)
        .call.like({ fn: get })
        .put(
          postsState.actions.loadPostsSuccess([
            { id: 1 } as Post,
            { id: 2 } as Post,
          ])
        )
        .dispatch(postsState.actions.loadPostsRequest())
        .silentRun();
    });

    it('should fail to fetch posts', async (): Promise<void> => {
      const error: Error = new Error('oops');

      (get as jest.Mock).mockRejectedValue(error);

      await expectSaga(rootSaga)
        .withState(mockState)
        .call.like({ fn: get })
        .put(postsState.actions.loadPostsFailure(error))
        .dispatch(postsState.actions.loadPostsRequest())
        .silentRun();
    });

    it('should cancel fetching posts', async (): Promise<void> => {
      const spyAbort = jest.spyOn(AbortController.prototype, 'abort');
      const gen = handleLoadPosts();

      gen.next();
      expect(gen.return(true).value).toEqual(cancelled());

      gen.next(true);
      expect(spyAbort).toHaveBeenCalledTimes(1);

      spyAbort.mockRestore();
    });
  });
});
