import React from 'react';
import { render } from '@testing-library/react';

import App from './App';

jest.mock('scenes/posts', () => (): JSX.Element => <></>);
jest.mock('scenes/photos', () => (): JSX.Element => <></>);
jest.mock('scenes/users', () => (): JSX.Element => <></>);

describe('App', (): void => {
  it('renders without an error', (): void => {
    const { container } = render(<App />);

    expect(container).toBeTruthy();
  });
});
