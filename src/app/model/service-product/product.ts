export interface Product {
    id?: number,
    name?: string,
    description?: string,
    specifies?: string,
    price?: number,
    discount?: number,
    categoryId?: number,
    availableEventTypesIds?: number[],
    visible: boolean,
    available: boolean,
    serviceProductProviderId?: number,
}