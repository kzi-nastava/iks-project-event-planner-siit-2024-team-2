import { ServiceProduct } from "../service-product/service-product";

export interface EventType {
    id: number;
    name: string;
    description: string;
    recommendedServiceProducts: ServiceProduct[];
}
/*
public class EventTypeDto {
    private long id;
    private String name;
    private String description;
    private List<ServiceProductNameIdDto> recommendedServiceProducts;
}
*/