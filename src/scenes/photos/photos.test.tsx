import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { Photo } from 'services/state/photos/photos.state';

import { Photos, Props } from '.';

const defaultProps: Props = {
  photos: [],
  pending: false,
  error: null,

  cancelPhotos: jest.fn(),
  loadPhotos: jest.fn(),
};

describe('photos', (): void => {
  it('renders without error', (): void => {
    expect(() => render(<Photos {...defaultProps} />)).not.toThrow();
  });

  it('calls to load photos on mount, then cancels the call on unmount', async (): Promise<void> => {
    const spyLoadPhotos = jest.fn();
    const spyCancelPhotos = jest.fn();
    const { unmount } = render(
      <Photos
        {...defaultProps}
        loadPhotos={spyLoadPhotos}
        cancelPhotos={spyCancelPhotos}
      />
    );

    unmount();

    await waitFor((): void => {
      expect(spyLoadPhotos).toHaveBeenCalledTimes(1);
      expect(spyCancelPhotos).toHaveBeenCalledTimes(1);
    });
  });

  it('renders the correct state when pending', (): void => {
    const { container, getByText } = render(
      <Photos {...defaultProps} pending />
    );

    expect(getByText('Please wait...')).toBeTruthy();
    expect(container.querySelectorAll('img')).toHaveLength(0);
  });

  it('renders a list of photos', (): void => {
    const photos: Photo[] = [
      {
        albumId: 1,
        id: 1,
        title: 'One',
        url: 'https://one.jpg',
        thumbnailUrl: 'https://one-small.jpg',
      },
      {
        albumId: 2,
        id: 2,
        title: 'Two',
        url: 'https://two.jpg',
        thumbnailUrl: 'https://two-small.jpg',
      },
    ];
    const { container, getByAltText } = render(
      <Photos {...defaultProps} photos={photos} />
    );

    expect(container.querySelectorAll('img')).toHaveLength(2);
    expect(getByAltText('One')).toBeTruthy();
    expect(getByAltText('Two')).toBeTruthy();
  });

  it('renders the correct state when there was an error', (): void => {
    const { getByText } = render(
      <Photos {...defaultProps} error={new Error()} />
    );

    expect(getByText('There was an error')).toBeTruthy();
  });
});
