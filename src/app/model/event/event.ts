import { UserDto } from "../../services/dtos/user/user.dto";
import { Activity } from "./activity";
import { EventType } from "./event-type";

export interface Event {
    id: number;
    name: string | null,
    description: string | null,
    date: string,
    type: EventType,
    eventOrganizerDto: UserDto | null,
    isOpen: boolean,
    maxAttendances: number | null,
    longitude: number | null,
    latitude: number | null,
    invitationEmails: string[] | null,
    budgets: any[],
    activity: Activity[] | null
}