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
}
/*
    private long id;
    private String name;
    private String description;
    private EventTypeDto type;
    private int maxAttendances;
    private boolean isOpen;
    private double longitude;
    private double latitude;
    private long date;
    private String creatorName;
    private String creatorEmail;
*/