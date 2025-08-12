
export interface ServiceProductDto {
    name: string | null | undefined;
    description: string | null | undefined;
    categoryId: number | null | undefined;
    available: boolean | null | undefined;
    visible: boolean | null | undefined;
    price: number | null | undefined;
    discount: number | null | undefined;
    images: string[] | null | undefined;
    availableEventTypeIds: number[] | null | undefined;
    serviceProductProviderId: number | null | undefined;
}