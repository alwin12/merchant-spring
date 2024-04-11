import { ShippingStatusEnum } from "../../enums";

export interface Order {
  Id: string;
  storeId: string;
  orderId: string;
  latest_ship_date: Date | string;
  shipment_status: ShippingStatusEnum;
  destination: string;
  items: string;
  orderValue: string;
}

export interface Store {
  storeId: string;
  marketplace: string;
  country: string;
  shopName: string;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  id: number;
}

export type OrderWithStoreDetails = Order & {
  overDueDays: number;
  store: Partial<Store>;
};

export interface OrdersWithPaginationInterface {
  orders: OrderWithStoreDetails[];
  pagination: {
    totalOrders: number;
    totalPages: number;
  };
}
