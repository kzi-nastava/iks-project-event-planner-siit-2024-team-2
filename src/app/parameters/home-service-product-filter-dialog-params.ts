import { ServiceProductFilteringValues } from "../services/dtos/service-product/service-product-filtering-values.dto";
import { ServiceProductFilterParams } from "./service-product-filter-params";

export interface HomeServiceProductFilterDialogParams {
    filter: ServiceProductFilterParams;
    filteringValues: ServiceProductFilteringValues;
}
