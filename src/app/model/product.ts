export interface Product {
    name?: string,
    description?: string,
    specifies?: string,
    price?: number,
    discount?: number,
    categoryId?: number,
    availableEventTypesIds?: number[],
    visibility: boolean,
    availability: boolean,
    serviceProductProviderId?: number,
}