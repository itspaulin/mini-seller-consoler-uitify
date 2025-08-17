import { useState, useEffect } from "react";

interface UrlParams {
  search: string;
  status: string;
  sortBy: string;
  sortOrder: string;
}

export function useUrlParams(): [
  UrlParams,
  (newParams: Partial<UrlParams>) => void
] {
  const [params, setParams] = useState<UrlParams>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      search: urlParams.get("search") || "",
      status: urlParams.get("status") || "",
      sortBy: urlParams.get("sortBy") || "score",
      sortOrder: urlParams.get("sortOrder") || "desc",
    };
  });

  const updateParams = (newParams: Partial<UrlParams>): void => {
    const updatedParams = { ...params, ...newParams };
    setParams(updatedParams);

    const urlParams = new URLSearchParams();
    Object.entries(updatedParams).forEach(([key, value]) => {
      if (value) urlParams.set(key, value);
    });

    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.replaceState({}, "", newUrl);
  };

  return [params, updateParams];
}
