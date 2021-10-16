import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { Post } from 'services/state/posts/posts.state';

import { Posts, Props } from '.';

const defaultProps: Props = {
  posts: [],
  pending: false,
  error: null,

  cancelPosts: jest.fn(),
  loadPosts: jest.fn(),
};

describe('posts', (): void => {
  it('renders without error', (): void => {
    expect(() => render(<Posts {...defaultProps} />)).not.toThrow();
  });

  it('calls to load posts on mount, then cancels the call on unmount', async (): Promise<void> => {
    const spyLoadPosts = jest.fn();
    const spyCancelPosts = jest.fn();
    const { unmount } = render(
      <Posts
        {...defaultProps}
        loadPosts={spyLoadPosts}
        cancelPosts={spyCancelPosts}
      />
    );

    unmount();

    await waitFor((): void => {
      expect(spyLoadPosts).toHaveBeenCalledTimes(1);
      expect(spyCancelPosts).toHaveBeenCalledTimes(1);
    });
  });

  it('renders the correct state when pending', (): void => {
    const { container, getByText } = render(
      <Posts {...defaultProps} pending />
    );

    expect(getByText('Please wait...')).toBeTruthy();
    expect(container.querySelectorAll('li')).toHaveLength(0);
  });

  it('renders a list of posts', (): void => {
    const posts: Post[] = [
      {
        userId: 1,
        id: 1,
        title: 'Title one',
        body: 'Content one',
      },
      {
        userId: 2,
        id: 2,
        title: 'Title two',
        body: 'Content two',
      },
    ];
    const { container, getByText } = render(
      <Posts {...defaultProps} posts={posts} />
    );

    expect(container.querySelectorAll('li')).toHaveLength(2);
    expect(getByText('Title one')).toBeTruthy();
    expect(getByText('Title two')).toBeTruthy();
  });

  it('renders the correct state when there was an error', (): void => {
    const { getByText } = render(
      <Posts {...defaultProps} error={new Error()} />
    );

    expect(getByText('There was an error')).toBeTruthy();
  });
});
