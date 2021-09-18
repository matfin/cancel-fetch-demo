import { useEffect } from 'react';
import { connect } from 'react-redux';

import { CombinedAppState } from '../../store';

import PhotosState, { Photo } from '../../services/state/photos/photos.state'

export interface Props {
  // state
  photos: Photo[];
  pending: boolean;
  error: Error | null;

  // dispatch
  loadPhotos: () => void;
}

const Photos = ({ photos, pending, error, loadPhotos }: Props): JSX.Element => {
  useEffect((): void => {
    loadPhotos();
  }, [loadPhotos]);

  return (
    <>
      <h1>A list of photos!</h1>
      {pending
        ? <p>Please wait...</p>
        : (
          <ul>
            {photos.map(({ id, thumbnailUrl, title }: Photo): JSX.Element => <img loading="lazy" alt={title} src={thumbnailUrl} key={id} />)}
          </ul>
        )
      }
      {error && <p>There was an error</p>}
    </>
  );
}

const mapStateToProps = (state: CombinedAppState) => ({
  photos: PhotosState.selectors.getAllPhotosFromState(state),
  pending: PhotosState.selectors.getIsPending(state),
  error: PhotosState.selectors.getError(state),
});

export const mapDispatchToProps = {
  loadPhotos: PhotosState.actions.loadPhotosRequest,
};

const ConnectedPhotos = connect(mapStateToProps, mapDispatchToProps)(Photos);

export default ConnectedPhotos;