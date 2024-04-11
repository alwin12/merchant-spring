import { ShippingStatusEnum } from "./enums";

/**
 
 * Tranforms a date string from 'dd/mm/yyyy' format to a javascript date object
 * as js date object does may not correctly parse 'dd/mm/yyyy' format from the csv
 *
 * 
 * @param {string} dateString - the date string in 'dd/mm/yyyy' format
 * @returns {Date} The Javascript date object corresponding to the given date string
 */
export const formatDate = (dateString: string): Date =>
  new Date(dateString.split("/").reverse().join("/"));

/**
 * Calculates the number of days overdue for a shipment.
 * If the shipment's status is 'Pending' and the current date is past the 'latestShipDate', it returns the number of days overdue.
 * Otherwise, it returns 0.
 */
export const getDaysOverdue = (
  status: ShippingStatusEnum,
  latestShipDate: string
) => {
  const formattedLatestShipDate = formatDate(latestShipDate);
  return status === ShippingStatusEnum.Pending &&
    formattedLatestShipDate < new Date()
    ? getDateDifference(formattedLatestShipDate, new Date())
    : 0;
};

/**
 * Calculates the difference between two dates in days.
 *
 */
const getDateDifference = (dateA: Date, dateB: Date) => {
  // Calculate the difference in milliseconds
  const differenceInMilliseconds = dateB.getTime() - dateA.getTime();
  // Convert milliseconds to days
  const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

  return Math.floor(differenceInDays);
};
