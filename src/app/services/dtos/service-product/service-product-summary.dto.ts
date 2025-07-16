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
/*
    private long id;
    private ServiceProductCategoryDto category;
    private boolean available;
    private double price;
    private double discount;
    private String name;
    private String description;
    private String creatorName;
    private String creatorEmail;
*/