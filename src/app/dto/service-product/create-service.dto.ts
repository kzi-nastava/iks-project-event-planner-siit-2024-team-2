import { ServiceProductDto } from "./service-product.dto";

export interface CreateServiceDto extends ServiceProductDto {
    specifies: string | null | undefined;
    duration: number | null | undefined;
    minEngagementDuration: number | null | undefined;
    maxEngagementDuration: number | null | undefined;
    reservationDaysDeadline: number | null | undefined;
    cancellationDaysDeadline: number | null | undefined;
    automaticReserved: boolean | null | undefined;
}
