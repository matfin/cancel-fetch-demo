export enum Methods {
  GET = 'get',
}

export const get = async <T>({
  url,
  method = Methods.GET,
  signal,
}: {
  url: string;
  method?: Methods;
  signal?: AbortSignal;
}): Promise<T | null> => {
  try {
    const request: Request = new Request(url, {
      headers: { 'Content-Type': 'application/json' },
      method,
      signal,
    });
    const response: Response = await fetch(request);

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return (await response.json()) as T;
  } catch (error) {
    return null;
  }
};
