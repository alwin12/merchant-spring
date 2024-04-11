import React from "react";

/**
 * I have used a lightweight table library to fit this specific use case. There are other libraries like MUI table , datagrid that can be used.
 * A table library can also be build from scratch depending on our use case
 */
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { useOrdersWithStoreDetails, usePagination } from "./hooks";
import { useSort } from "@table-library/react-table-library/sort";

import { type OrderWithStoreDetails } from "./types";

export const OverdueOrders = () => {
  const {
    page,
    pageSize,
    sortOrder,
    updateSortOrder,
    incrementPage,
    decrementPage,
  } = usePagination();

  const { data, isLoading, error } = useOrdersWithStoreDetails(
    page,
    pageSize,
    sortOrder
  );

  const theme = useTheme(getTheme());

  /**
  Library specific hook for sorting the table.
  As sorting is done on the server side the only purpose of calling this hook is to get the sort icon on the column header.
  TODO: Refactor or implement alternate solutions
  */
  const sort = useSort(
    {
      nodes:
        data && data.orders
          ? data.orders.map((order) => ({ ...order, id: order.Id }))
          : [],
    },
    {
      onChange: onSortChange,
    },
    {
      sortFns: {},
    }
  );

  if (isLoading) {
    // Loading UI can be displayed depending on the design
    return <div>Loading..</div>;
  }

  if (error) {
    return <div>Unable to load the orders</div>;
  }

  if (!data?.orders || (data.orders && data.orders.length <= 0)) {
    return <div>empty state</div>;
  }

  const handlePreviousButtonClick = () => {
    if (page > 1) {
      decrementPage();
    }
  };

  const handleNextButtonClick = () => {
    const { pagination } = data;

    if (page <= pagination.totalPages) {
      incrementPage();
    }
  };

  const tableData = {
    nodes: data.orders,
  };

  function onSortChange(action: any, state: any) {
    updateSortOrder();
  }

  return (
    <div>
      <CompactTable
        columns={COLUMNS}
        data={tableData}
        theme={theme}
        sort={sort}
      />
      <br />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Total Pages: {data.pagination.totalPages}</span>
        <span>
          Page {page}: <button onClick={handlePreviousButtonClick}>prev</button>
          <button onClick={handleNextButtonClick}> next</button>
        </span>
      </div>
    </div>
  );
};

const COLUMNS = [
  {
    label: "MARKETPLACE",
    renderCell: (orderWithStoreDetails: OrderWithStoreDetails) =>
      orderWithStoreDetails.store.marketplace,
  },
  {
    label: "STORE",
    renderCell: (salewithStoreDetails: OrderWithStoreDetails) =>
      salewithStoreDetails.store.shopName,
  },
  {
    label: "ORDER ID",
    renderCell: (salewithStoreDetails: OrderWithStoreDetails) =>
      salewithStoreDetails.orderId,
  },
  {
    label: "ORDER VALUE",
    renderCell: (salewithStoreDetails: OrderWithStoreDetails) =>
      salewithStoreDetails.orderValue,
  },
  {
    label: "ITEMS",
    renderCell: (salewithStoreDetails: OrderWithStoreDetails) =>
      salewithStoreDetails.items,
  },
  {
    label: "DESTINATION",
    renderCell: (salewithStoreDetails: OrderWithStoreDetails) =>
      salewithStoreDetails.destination,
  },
  {
    label: "DAYS OVERDUE",
    renderCell: (orderWithStoreDetails: OrderWithStoreDetails) =>
      orderWithStoreDetails.overDueDays,
    sort: { sortKey: "DAYS_OVERDUE" },
  },
];
