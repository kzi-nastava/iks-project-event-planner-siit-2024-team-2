export interface Event {
    id?: any;
    name: string | null | undefined,
    description: string | null | undefined,
    date: string | null | undefined,
    latitude: number | null | undefined,
    longitude: number | null | undefined,
    eventTypeId: number | null | undefined,
    maxAttendances: number | null | undefined,
    open: boolean,
    budgets: any[],
    invitationEmails: string[] | null
}