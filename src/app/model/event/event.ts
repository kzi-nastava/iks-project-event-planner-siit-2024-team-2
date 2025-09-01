import { UserDto } from "../../services/dtos/user/user.dto";
import { Budget } from "../budget/budget";
import { Activity } from "./activity";
import { EventType } from "./event-type";

export interface Event {
    id: number;
    name: string | null,
    description: string | null,
    date: string,
    type: EventType,
    eventOrganizerDto: UserDto | null,
    open: boolean,
    maxAttendances: number | null,
    longitude: number | null,
    latitude: number | null,
    invitationEmails: string[] | null,
    budgets: Budget[],
    activity: Activity[] | null
}