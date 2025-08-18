export interface Message {
    message: string,
    fromId: string,
    toId: string,
    topic: string,
    subtopic: string,
    timestamp: number
}