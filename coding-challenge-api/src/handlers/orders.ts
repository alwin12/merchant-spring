import { Request, Response } from "express";

import path from "path";
import fs from "fs";
import zlib from "zlib";
import readline from "readline";

import {
  type OrderWithStoreDetails,
  type Store,
  type OrdersWithPaginationInterface,
} from "../types";

import { getDaysOverdue } from "../utils";
import { ShippingStatusEnum } from "../enums";

type SortOrder = "asc" | "desc";

export async function getOrders(req: Request, res: Response) {
  const page = parseInt(req.query.page as string) ?? 1;
  const pageSize = parseInt(req.query.pageSize as string) ?? 10;

  // Only considering sorting by overdue days for the purpose of this task. This can be extended to support sorting by other variables
  const sortOrder = (req.query.sortOrder as SortOrder) ?? ("desc" as SortOrder);

  // Read and store all stores from store.csv
  const storeFileLineReader = readline.createInterface({
    input: fs.createReadStream(
      path.resolve(__dirname, "../../data/stores.csv")
    ),
    crlfDelay: Infinity,
  });

  // Create a stream for reading the GZip file and pipe it through zlib to decompress
  const orderFileLineReader = readline.createInterface({
    input: fs
      .createReadStream(path.resolve(__dirname, "../../data/orders.csv.gz"))
      .pipe(zlib.createGunzip()),
  });

  let ordersData = await generateOrdersDataFromFileLineReader(
    storeFileLineReader,
    orderFileLineReader
  );

  if (ordersData.length == 0) {
    res.json({
      orders: [],
      pagination: {
        totalOrders: 0,
        totalPages: 0,
      },
    });
  }

  /*
  Encapsulating the logic into another function so that the sorting can be extended to other variables
  */
  ordersData = sortOrders(ordersData, sortOrder);

  const paginatedOrders = generatePaginatedOrdersAndMetadata(
    ordersData,
    page,
    pageSize
  );

  res.json(paginatedOrders);
}

export const generateOrdersDataFromFileLineReader = async (
  storeFileLineReader: readline.Interface,
  orderFileLineReader: readline.Interface
) => {
  let storeData: Store[] = [];
  let ordersData: OrderWithStoreDetails[] = [];

  for await (const line of storeFileLineReader) {
    const [storeId, marketplace, country, shopName] = line.split(",");
    storeData.push({
      storeId,
      marketplace,
      country,
      shopName,
    });
  }

  // Removing column names
  storeData = [...storeData.slice(1)];

  // Assuming orders cannot exist without a store
  if (storeData.length == 0) {
    return [];
  }

  for await (const line of orderFileLineReader) {
    const [
      Id,
      storeId,
      orderId,
      latest_ship_date,
      shipment_status,
      destination,
      items,
      orderValue,
    ] = line.split(",");

    // finding the store associated with the order
    const store = storeData.find((store) => store.storeId === storeId) ?? {};

    // Calculating the number of days an order's shipment has been overdue for
    const overDueDays = getDaysOverdue(
      shipment_status as ShippingStatusEnum,
      latest_ship_date
    );

    ordersData.push({
      Id,
      storeId,
      orderId,
      latest_ship_date,
      shipment_status: shipment_status as ShippingStatusEnum,
      destination,
      items,
      orderValue,
      store,
      overDueDays,
    });
  }

  return [...ordersData.splice(1)];
};

//Sort orders based on the sortOrder param value from the request
const sortOrders = (
  ordersData: OrderWithStoreDetails[],
  sortOrder: SortOrder
) =>
  ordersData.sort(
    (orderA: OrderWithStoreDetails, orderB: OrderWithStoreDetails) =>
      sortOrder === "asc"
        ? orderA.overDueDays - orderB.overDueDays
        : orderB.overDueDays - orderA.overDueDays
  );

const generatePaginatedOrdersAndMetadata = (
  ordersData: OrderWithStoreDetails[],
  page: number,
  pageSize: number
): OrdersWithPaginationInterface => {
  const paginatedOrders = ordersData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalOrders = ordersData.length;
  const totalPages = Math.ceil(totalOrders / pageSize);

  return {
    orders: paginatedOrders,
    pagination: {
      totalOrders,
      totalPages,
    },
  };
};
