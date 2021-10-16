import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { User } from 'services/state/users/users.state';

import { Users, Props } from '.';

const defaultProps: Props = {
  users: [],
  pending: false,
  error: null,

  cancelUsers: jest.fn(),
  loadUsers: jest.fn(),
};

describe('users', (): void => {
  it('renders without error', (): void => {
    expect(() => render(<Users {...defaultProps} />)).not.toThrow();
  });

  it('calls to load users on mount, then cancels the call on unmount', async (): Promise<void> => {
    const spyLoadUsers = jest.fn();
    const spyCancelUsers = jest.fn();
    const { unmount } = render(
      <Users
        {...defaultProps}
        loadUsers={spyLoadUsers}
        cancelUsers={spyCancelUsers}
      />
    );

    unmount();

    await waitFor((): void => {
      expect(spyLoadUsers).toHaveBeenCalledTimes(1);
      expect(spyCancelUsers).toHaveBeenCalledTimes(1);
    });
  });

  it('renders the correct state when pending', (): void => {
    const { container, getByText } = render(
      <Users {...defaultProps} pending />
    );

    expect(getByText('Please wait...')).toBeTruthy();
    expect(container.querySelectorAll('li')).toHaveLength(0);
  });

  it('renders a list of users', (): void => {
    const users: User[] = [
      {
        id: 1,
        name: 'User One',
      } as User,
      {
        id: 2,
        name: 'User Two',
      } as User,
    ];
    const { container, getByText } = render(
      <Users {...defaultProps} users={users} />
    );

    expect(container.querySelectorAll('li')).toHaveLength(2);
    expect(getByText('User One')).toBeTruthy();
    expect(getByText('User Two')).toBeTruthy();
  });

  it('renders the correct state when there was an error', (): void => {
    const { getByText } = render(
      <Users {...defaultProps} error={new Error()} />
    );

    expect(getByText('There was an error')).toBeTruthy();
  });
});
