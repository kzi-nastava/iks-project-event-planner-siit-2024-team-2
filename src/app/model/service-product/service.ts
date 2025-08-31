import { ServiceProduct } from "./service-product";

export interface Service extends ServiceProduct {
    specifies: string | null;
    imageEncodedNames: string[] | null;
    duration: number | null;
    reservationDaysDeadline: number | null;
    cancellationDaysDeadline: number | null;
    automaticReserved: boolean | null;
    minEngagementDuration: number | null;
    maxEngagementDuration: number | null;
}
