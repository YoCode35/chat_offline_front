export function http() {
  const API = "http://localhost:3000";

  const buildUrl = (path: string, params?: Record<string, string | number>) => {
    const url = new URL(`${API}${path}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }
    return url.toString();
  };

  const get = async <T>(
    path: string,
    params?: Record<string, string | number>
  ): Promise<T> => {
    const res = await fetch(buildUrl(path, params), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("token") ?? ""}`,
      },
    });

    if (!res.ok) {
      throw new Error(`GET ${path} failed: ${res.status} ${res.statusText}`);
    }

    return res.json() as Promise<T>;
  };

  return { get };
}
