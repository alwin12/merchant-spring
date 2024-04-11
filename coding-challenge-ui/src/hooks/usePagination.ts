import { useState, useEffect } from "react";

export type SortOrder = "asc" | "desc";

interface UsePaginationHook {
  page: number;
  pageSize: number;
  sortOrder: SortOrder;
  updateSortOrder: () => void;
  incrementPage: () => void;
  decrementPage: () => void;
  updatePageSize: (pageSize: number) => void;
}

// Define a hook that returns the current page and page size based on URL query parameters
// and provides functions to update them, which also updates the URL.
export const usePagination = (): UsePaginationHook => {
  const getQueryValue = (key: string, defaultValue: string): string => {
    const params = new URLSearchParams(window.location.search);
    return params.get(key) || defaultValue;
  };

  const [page, setPage] = useState<number>(
    parseInt(getQueryValue("page", "1"), 10)
  );
  const [pageSize, setPageSize] = useState<number>(
    parseInt(getQueryValue("pageSize", "10"), 10)
  );

  const [sortOrder, setSortOrder] = useState<SortOrder>(
    getQueryValue("sortOrder", "desc") as SortOrder
  );

  // Update the URL query parameters when page or pageSize changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", page.toString());
    params.set("pageSize", pageSize.toString());
    params.set("sortOrder", sortOrder);

    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params}`
    );
  }, [page, pageSize, sortOrder]);

  const incrementPage = () => setPage((prevPage) => prevPage + 1);
  const decrementPage = () => setPage((prevPage) => prevPage - 1);
  const updateSortOrder = () =>
    setSortOrder((previousSortOrder) =>
      previousSortOrder === "desc" ? "asc" : "desc"
    );

  // This functionality is not required on the wireframe but can be used as an extension
  const updatePageSize = (newPageSize: number) => setPageSize(newPageSize);

  return {
    page,
    pageSize,
    sortOrder,
    updateSortOrder,
    incrementPage,
    decrementPage,
    updatePageSize,
  };
};
