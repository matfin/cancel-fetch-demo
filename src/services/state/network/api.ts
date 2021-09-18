export enum Methods {
  GET = "get",
}

export const get = async <T>({
  url,
  method = Methods.GET,
}: {
  url: string;
  method?: Methods;
}): Promise<T | null> => {
  try {
    const response: Response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
    });
    const data: T = await response.json();

    return data;
  } catch (error) {
    return null;
  }
};
