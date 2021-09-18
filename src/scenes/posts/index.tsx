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
  cancelPosts: () => void;
  loadPosts: () => void;
}

const Posts = ({ posts, pending, error, cancelPosts, loadPosts }: Props): JSX.Element => {
  useEffect((): () => void => {
    loadPosts();

    return (): void => cancelPosts();
  }, [loadPosts, cancelPosts]);

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
  cancelPosts: PostsState.actions.loadPostsCancel,
  loadPosts: PostsState.actions.loadPostsRequest,
};

const ConnectedPosts = connect(mapStateToProps, mapDispatchToProps)(Posts);

export default ConnectedPosts;