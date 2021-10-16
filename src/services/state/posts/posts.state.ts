import { createSelector } from 'reselect';

// types

export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export type Payload = {
  posts?: Post[];
  error?: Error;
};

export type PostsAction = {
  type: string;
  payload?: Payload;
  error?: Error;
};

export type PostsState = {
  posts: Post[];
  pending: boolean;
  error?: Error | null;
};

// constants
const reducerName = 'posts';
const FETCH_POSTS_REQUEST = `${reducerName}/FETCH_POSTS_REQUEST`;
const FETCH_POSTS_CANCEL = `${reducerName}/FETCH_POSTS_CANCEL`;
const FETCH_POSTS_SUCCESS = `${reducerName}/FETCH_POSTS_SUCCESS`;
const FETCH_POSTS_FAILURE = `${reducerName}/FETCH_POSTS_FAILURE`;

// actions
const loadPostsRequest = (): PostsAction => ({
  type: FETCH_POSTS_REQUEST,
});

const loadPostsCancel = (): PostsAction => ({
  type: FETCH_POSTS_CANCEL,
});

const loadPostsSuccess = (posts: Post[]): PostsAction => ({
  type: FETCH_POSTS_SUCCESS,
  payload: { posts },
});

const loadPostsFailure = (error: Error): PostsAction => ({
  type: FETCH_POSTS_FAILURE,
  payload: { error },
});

// reducer
export const initialState: PostsState = {
  posts: [],
  pending: false,
  error: null,
};

const reducer = (state = initialState, action: PostsAction) => {
  const { type, payload, error } = action;

  switch (type) {
    case FETCH_POSTS_REQUEST: {
      return {
        ...state,
        pending: true,
      };
    }
    case FETCH_POSTS_SUCCESS: {
      return {
        ...state,
        pending: false,
        posts: payload?.posts ?? [],
      };
    }
    case FETCH_POSTS_FAILURE: {
      return {
        ...state,
        pending: false,
        error,
      };
    }
    default: {
      return state;
    }
  }
};

// selectors
const getPostsState = ({ posts }: { posts: PostsState }) => posts;
const getAllPostsFromState = createSelector(
  getPostsState,
  ({ posts }: PostsState) => posts
);
const getIsPending = createSelector(
  getPostsState,
  ({ pending }: PostsState) => pending
);
const getError = createSelector(
  getPostsState,
  ({ error }: PostsState) => error
);

const postsState = {
  actions: {
    loadPostsRequest,
    loadPostsCancel,
    loadPostsSuccess,
    loadPostsFailure,
  },
  types: {
    FETCH_POSTS_REQUEST,
    FETCH_POSTS_CANCEL,
    FETCH_POSTS_SUCCESS,
    FETCH_POSTS_FAILURE,
  },
  selectors: {
    getAllPostsFromState,
    getError,
    getIsPending,
  },
  name: reducerName,
  reducer,
};

export default postsState;
