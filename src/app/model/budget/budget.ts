import { ServiceProductCategory } from "../service-product/service-product-category";
import { Booking } from "./booking";
import { Purchase } from "./purchase";

export interface Budget {
    id: number,
    name: string,
    serviceProductCategory: ServiceProductCategory | null,
    currentSpent: number,
    plannedSpending: number,
    bookings: Booking[],
    purchases: Purchase[]
}