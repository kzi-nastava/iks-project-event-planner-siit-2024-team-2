
export interface ServiceProductDto {
    name: string | null;
    description: string | null;
    categoryId: number | null;
    available: boolean | null;
    visible: boolean | null;
    price: number | null;
    discount: number | null;
    images: string[] | null;
    availableEventTypeIds: number[] | null;
    serviceProductProviderId: number | null;
}