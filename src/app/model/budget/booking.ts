import { Service } from "../service-product/service";

export interface Booking {
    id: number;
    service: Service;
    price: number;
    date: Date;
    duration: number;
}