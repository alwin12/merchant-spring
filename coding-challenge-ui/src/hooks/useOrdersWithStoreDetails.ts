import { useState, useEffect } from "react";

import { OrdersWithPaginationInterface } from "../types";

import { type SortOrder } from "./usePagination";

type UseOrdersWithStoreDetailsHook = {
  data: OrdersWithPaginationInterface | undefined;
  isLoading: boolean;
  error: string | null;
};

export const useOrdersWithStoreDetails = (
  page: number,
  pageSize: number,
  sortOrder: SortOrder
): UseOrdersWithStoreDetailsHook => {
  const [data, setData] = useState<OrdersWithPaginationInterface>();
  const [isLoading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `http://localhost:8080/sales?page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const ordersWithPaginationInterface: OrdersWithPaginationInterface =
          await response.json();
        setData(ordersWithPaginationInterface);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function if required
    return () => {};
  }, [page, pageSize, sortOrder]);

  return { data, isLoading, error };
};
