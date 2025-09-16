import { SafeHtml } from "@angular/platform-browser";
import { UserDto } from "../../dto/user/user.dto";

export interface Notification {
    id: number,
    title: string | null,
    message: string | null,
    sentAt: Date | null,
    seen: boolean | null,
    dismissed: boolean | null,
    dismissing: boolean | null,
    userDto: UserDto | null,
    formattedTitle: SafeHtml | null,
    formattedMessage: SafeHtml | null,
}