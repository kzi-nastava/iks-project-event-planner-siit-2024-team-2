import { ChatStatus } from "../../../model/utils/chat-status";

export interface ChatDto {
    toId: number;
    messageIds: number[];
    status: ChatStatus;
}