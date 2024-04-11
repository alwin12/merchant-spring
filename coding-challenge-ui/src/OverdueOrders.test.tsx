import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { OverdueOrders } from "./OverdueOrders";
import { useOrdersWithStoreDetails } from "./hooks";

// Mock the hooks
jest.mock("./hooks", () => ({
  usePagination: () => ({
    page: 1,
    pageSize: 10,
    sortOrder: "asc",
    updateSortOrder: jest.fn(),
    incrementPage: jest.fn(),
    decrementPage: jest.fn(),
  }),
  useOrdersWithStoreDetails: jest.fn(),
}));

describe("OverdueOrders Component", () => {
  test("renders loading state", () => {
    (useOrdersWithStoreDetails as jest.Mock).mockReturnValue({
      data: null,
      loading: true,
      error: null,
    });

    const { getByText } = render(<OverdueOrders />);

    expect(getByText(/Unable to load the orders/i)).toBeInTheDocument();
  });

  test("renders error state", () => {
    // TODO: Test error state rendering
  });

  test("renders data table when data is available", () => {
    // TODO: Test data rendering
  });

  test("handles pagination correctly", async () => {
    //TODO:  Ensure `incrementPage` and `decrementPage` functions are called when next/prev buttons are clicked
  });

  test("handles sorting", async () => {
    // TODO: Test sorting
  });
});
