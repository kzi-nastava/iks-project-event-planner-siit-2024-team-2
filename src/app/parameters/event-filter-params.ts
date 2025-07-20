import { SortDirection } from "../shared/model/sort-direction";

export interface EventFilterParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: SortDirection;
  name?: string;
  description?: string;
  types?: number[];
  minMaxAttendances?: number;
  maxMaxAttendances?: number;
  open?: boolean;
  latitudes?: number[];
  longitudes?: number[];
  maxDistance?: number;
  startDate?: number;
  endDate?: number;
}
