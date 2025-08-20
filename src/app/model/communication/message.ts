export interface Message {
    message: string,
    title: string | null,
    fromId: string | null,
    toId: string,
    topic: string,
    subtopic: string,
    timestamp: number
}