import { ServiceProductDType } from "../model/utils/service-product-dtype";
import { SortDirection } from "../shared/model/sort-direction";

export interface ServiceProductFilterParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: SortDirection;
  name?: string;
  description?: string;
  type?: ServiceProductDType;
  categories?: number[];
  available?:boolean;
  visible?:boolean;
  minPrice?:number;
  maxPrice?:number;
  availableEventTypeIds?:number[];
  serviceProductProviderId?:number;
  minDuration?:number;
  maxDuration?:number;
  automaticReserved?:boolean;
}
