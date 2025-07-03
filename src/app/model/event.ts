export interface Event {
    name: string | null | undefined,
    description: string | null | undefined,
    date: string | null | undefined,
    latitude: number | null | undefined,
    longitude: number | null | undefined,
    eventType: number | null | undefined,
    maxAttendances: number | null | undefined,
    open: boolean
}