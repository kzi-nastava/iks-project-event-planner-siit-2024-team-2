import { EventType } from "../../model/event/event-type";
import { ServiceProductCategory } from "../../model/service-product/service-product-category";

export interface ServiceProductFilteringValues {
    minPrice: number | null;
    maxPrice: number | null;
    minDuration: number | null;
    maxDuration: number | null;
    categories: ServiceProductCategory[] | null;
    availableEventTypes: EventType[] | null;
}
/*
    private Double minPrice;
    private Double maxPrice;
    private Float minDuration;
    private Float maxDuration;
    private List<ServiceProductCategory> categories;
    private List<EventType> availableEventTypes;
*/