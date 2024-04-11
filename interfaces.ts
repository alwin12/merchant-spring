import { ShippingStatusEnum } from "./enums";

export interface Sale {
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
