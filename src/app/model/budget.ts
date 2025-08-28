import { ServiceProductCategory } from "./service-product/service-product-category";

export interface Budget {
    id: number,
    name: string,
    category: ServiceProductCategory,
    currentSpent: number,
    plannedSpending: number,
    bookings: any[];
    purchases: any[]
}