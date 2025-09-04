import { User } from "../user/user";
import { ChatStatus } from "../utils/chat-status";
import { ChatMessage } from "./chat-message";

export interface Chat {
    id: number;
    lastMessage: string;
    lastMessageDate: Date;
    user1: User;
    user2: User;
    sentAt: Date;
    messages: ChatMessage[];
    status: ChatStatus;
    user1BlockedUser2: boolean;
    user2BlockedUser1: boolean;
}