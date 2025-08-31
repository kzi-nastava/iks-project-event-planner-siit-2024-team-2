import { ServiceProductCategoryDto } from "./service-product-category.dto";

export interface ServiceProductSummaryDto {
    id: number | null;
    name: string | null;
    description: string | null;
    category: ServiceProductCategoryDto | null;
    price: number | null;
    discount: number | null;
    available: boolean | null;
    creatorName: string | null;
    creatorEmail: string | null;
    image: string | null;
}