import { EventType } from "../model/event-type";
import { ServiceProductCategory } from "../model/service-product/service-product-category";
import { ServiceProductFilteringValues } from "../services/dtos/service-product/service-product-filtering-values.dto";
import { ServiceProductFilterParams } from "./service-product-filter-params";

export interface HomeServiceProductFilterDialogParams {
    filter: ServiceProductFilterParams;
    filteringValues: ServiceProductFilteringValues;
    selectedCategories: ServiceProductCategory[];
    selectedEventTypes: EventType[];
}
