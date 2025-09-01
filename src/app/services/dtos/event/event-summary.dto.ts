import { EventTypeDto } from "./event-type.dto";

export interface EventSummaryDto {
    id: number | null;
    name: string | null;
    description: string | null;
    type: EventTypeDto | null;
    maxAttendances: number | null;
    isOpen: boolean | null;
    longitude: number | null;
    latitude: number | null;
    date: number | null;
    creatorName: string | null;
    creatorEmail: string | null;
    creatorProfilePicture: string | null;
}
