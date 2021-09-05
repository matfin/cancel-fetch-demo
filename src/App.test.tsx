import { render } from '@testing-library/react';
import App from './App';

describe('App', (): void => {
  it('renders learn react link', (): void => {
    const { container } = render(<App />);

    expect(container).toBeTruthy();
  });
});
