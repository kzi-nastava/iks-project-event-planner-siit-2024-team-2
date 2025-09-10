import { User } from "../user/user";

export interface ChatMessage {
    id: number;
    text: string;
    sentAt: Date;
    toUser: User;
    seen: boolean;
}