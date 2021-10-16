import { get } from './api';

describe('api', (): void => {
  afterEach((): void => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('fetches data successfully', async (): Promise<void> => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: (): Promise<unknown> => Promise.resolve({ it: 'works!' }),
    } as Response);

    const result: unknown = await get<unknown>({ url: 'https://test.ie' });

    expect(result).toEqual({ it: 'works!' });
  });

  it('throws if the response was not ok', async (): Promise<void> => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      statusText: 'failed',
    } as Response);

    const result: unknown = await get<unknown>({ url: 'https://oops.ie' });

    expect(result).toBeNull();
  });
});
