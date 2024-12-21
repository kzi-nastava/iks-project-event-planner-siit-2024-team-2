export interface Event {
    name: string,
    description: string,
    date: Date,
    latitude: number,
    longitude: number,
    eventType: number,
    maxAttandances: number,
    isOpen: boolean
}