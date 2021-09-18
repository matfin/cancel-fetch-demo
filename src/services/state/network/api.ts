export enum Methods {
  GET = "get",
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
      headers: { "Content-Type": "application/json" },
      method,
      signal,
    });
    const response = await fetch(request);
    const data: T = await response.json();

    return data;
  } catch (error) {
    return null;
  }
};
