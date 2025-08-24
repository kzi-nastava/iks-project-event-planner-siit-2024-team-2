export interface EventTypeDto {
    id: number;
    name: string | null;
    recommendedServiceProductIds: number[] | null;
    description: string | null;
}
