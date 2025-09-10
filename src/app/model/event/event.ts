import { Budget } from "../budget/budget";
import { User } from "../user/user";
import { Activity } from "./activity";
import { EventType } from "./event-type";

export interface Event {
    id: number;
    name: string | null,
    description: string | null,
    date: string,
    type: EventType,
    eventOrganizerDto: User | null,
    open: boolean,
    maxAttendances: number | null,
    longitude: number | null,
    latitude: number | null,
    invitationEmails: string[] | null,
    budgets: Budget[],
    activity: Activity[] | null
}