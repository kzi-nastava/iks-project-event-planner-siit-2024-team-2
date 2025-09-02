import { User } from "../user/user";

export interface ChatMessage {
    id: number;
    text: string;
    sentAt: Date;
    fromUser: User;
    seen: boolean;
}