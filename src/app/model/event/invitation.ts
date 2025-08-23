import { Event } from "./event";

export interface Invitation {
    id: number,
    eventDto: Event,
    email: string,
    token: string,
    accepted: boolean,
    quickRegistration: boolean
}