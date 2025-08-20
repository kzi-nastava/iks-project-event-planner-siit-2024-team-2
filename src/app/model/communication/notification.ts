import { User } from "../../services/dtos/user";

export interface Notification {
    id: number,
    title: string | null,
    message: string | null,
    sentAt: Date | null,
    seen: boolean | null,
    dismissed: boolean | null,
    dismissing: boolean | null,
    userDto: User | null
}