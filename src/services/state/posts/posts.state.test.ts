import postsState, { initialState, Post, PostsState } from './posts.state';

describe('posts.state', (): void => {
  describe('actions', (): void => {
    it('loadPostsRequest', (): void => {
      expect(postsState.actions.loadPostsRequest()).toEqual({
        type: postsState.types.FETCH_POSTS_REQUEST,
      });
    });

    it('loadPostsCancel', (): void => {
      expect(postsState.actions.loadPostsCancel()).toEqual({
        type: postsState.types.FETCH_POSTS_CANCEL,
      });
    });

    it('loadPostsSuccess', (): void => {
      expect(postsState.actions.loadPostsSuccess([])).toEqual({
        type: postsState.types.FETCH_POSTS_SUCCESS,
        payload: {
          posts: [],
        },
      });
    });

    it('loadPostsFailure', (): void => {
      const error = new Error('failed');

      expect(postsState.actions.loadPostsFailure(error)).toEqual({
        type: postsState.types.FETCH_POSTS_FAILURE,
        payload: { error },
      });
    });
  });

  describe('reducer', (): void => {
    it('updates the reducer when requesting posts', (): void => {
      const state: PostsState = postsState.reducer(undefined, {
        type: postsState.types.FETCH_POSTS_REQUEST,
      });
      const expected: PostsState = {
        ...initialState,
        pending: true,
      };

      expect(state).toEqual(expected);
    });

    it('updates the reducer when fetching posts was successful', (): void => {
      const posts: Post[] = [{} as Post, {} as Post];
      const state: PostsState = postsState.reducer(undefined, {
        type: postsState.types.FETCH_POSTS_SUCCESS,
        payload: {
          posts,
        },
      });
      const expected: PostsState = {
        ...initialState,
        pending: false,
        posts,
      };

      expect(state).toEqual(expected);
    });

    it('updates the reducer when fetching posts was successful but there are no posts', (): void => {
      const state: PostsState = postsState.reducer(undefined, {
        type: postsState.types.FETCH_POSTS_SUCCESS,
      });
      const expected: PostsState = {
        ...initialState,
        pending: false,
        posts: [],
      };

      expect(state).toEqual(expected);
    });

    it('updates the reducer when there was an error requesting posts', (): void => {
      const error = new Error('failed');
      const state: PostsState = postsState.reducer(undefined, {
        type: postsState.types.FETCH_POSTS_FAILURE,
        error,
      });
      const expected: PostsState = {
        ...initialState,
        pending: false,
        error,
      };

      expect(state).toEqual(expected);
    });

    it('returns the default state', (): void => {
      expect(
        postsState.reducer(undefined, {
          type: 'SOMETHING_ELSE',
        })
      ).toEqual(initialState);
    });
  });

  describe('selectors', (): void => {
    const state: PostsState = {
      posts: [{ id: 1 } as Post, { id: 2 } as Post],
      pending: false,
      error: null,
    };

    it('gets all posts from the state', (): void => {
      expect(
        postsState.selectors.getAllPostsFromState({ posts: state })
      ).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it('gets the pending state', (): void => {
      expect(postsState.selectors.getIsPending({ posts: state })).toEqual(
        false
      );
    });

    it('gets the error', (): void => {
      expect(postsState.selectors.getError({ posts: state })).toEqual(null);
    });
  });
});
