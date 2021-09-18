import { useEffect } from 'react';
import { connect } from 'react-redux';

import { CombinedAppState } from '../../store';

import PostsState, { Post } from '../../services/state/posts/posts.state'

export interface Props {
  // state
  posts: Post[];
  pending: boolean;
  error: Error | null;

  // dispatch
  loadPosts: () => void;
}

const Posts = ({ posts, pending, error, loadPosts }: Props): JSX.Element => {
  useEffect((): void => {
    loadPosts();
  }, [loadPosts]);

  return (
    <>
      <h1>A list of posts!</h1>
      {pending
        ? <p>Please wait...</p>
        : (
          <ul>
            {posts.map(({ id, title }: Post): JSX.Element => <li key={id}>{title}</li>)}
          </ul>
        )
      }
      {error && <p>There was an error</p>}
    </>
  );
}

const mapStateToProps = (state: CombinedAppState) => ({
  posts: PostsState.selectors.getAllPostsFromState(state),
  pending: PostsState.selectors.getIsPending(state),
  error: PostsState.selectors.getError(state),
});

export const mapDispatchToProps = {
  loadPosts: PostsState.actions.loadPostsRequest,
};

const ConnectedPosts = connect(mapStateToProps, mapDispatchToProps)(Posts);

export default ConnectedPosts;