import { EventType } from "../model/event/event-type";
import { City } from "../model/utils/city";
import { EventFilterParams } from "./event-filter-params";

export interface HomeEventFilterDialogParams {
    filter: EventFilterParams;
    allEventTypes: EventType[];
    selectedEventTypes: EventType[];
    fullMaxAttendancesRange: number[];
    allCities: City[];
    selectedCities: City[];
}
