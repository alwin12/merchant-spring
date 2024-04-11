import { renderHook, act } from "@testing-library/react-hooks";
import { usePagination } from "./usePagination";

// Mocking window.location.search functionality
const mockLocationSearch = (searchString: string) => {
  Object.defineProperty(window, "location", {
    value: {
      search: searchString,
    },
    writable: true,
  });
};

describe("usePagination Hook", () => {
  beforeEach(() => {
    mockLocationSearch("?page=2&pageSize=20&sortOrder=asc");
  });

  test("should initialize state from URL parameters", () => {
    const { result } = renderHook(() => usePagination());

    expect(result.current.page).toBe(2);
    expect(result.current.pageSize).toBe(20);
    expect(result.current.sortOrder).toBe("asc");
  });

  test("should increment page", () => {
    const { result } = renderHook(() => usePagination());

    act(() => {
      result.current.incrementPage();
    });

    expect(result.current.page).toBe(3);
  });

  test("should decrement page", () => {
    const { result } = renderHook(() => usePagination());

    act(() => {
      result.current.decrementPage();
    });

    expect(result.current.page).toBe(1);
  });

  test("should update page size", () => {
    const { result } = renderHook(() => usePagination());

    act(() => {
      result.current.updatePageSize(30);
    });

    expect(result.current.pageSize).toBe(30);
  });

  test("should toggle sort order", () => {
    const { result } = renderHook(() => usePagination());

    act(() => {
      result.current.updateSortOrder();
    });

    expect(result.current.sortOrder).toBe("desc");
  });
});
