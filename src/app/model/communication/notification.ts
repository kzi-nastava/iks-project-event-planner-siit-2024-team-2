import { UserDto } from "../../services/dtos/user/user";

export interface Notification {
    id: number,
    title: string | null,
    message: string | null,
    sentAt: Date | null,
    seen: boolean | null,
    dismissed: boolean | null,
    dismissing: boolean | null,
    userDto: UserDto | null
}