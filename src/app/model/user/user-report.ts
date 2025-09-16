import { UserDto } from "../../dto/user/user.dto";

export interface UserReport {
    id: number | null,
    reporter: UserDto | null,
    reported: UserDto | null,
    approvedAt: Date | null,
    reason: string | null,
    createdAt: Date | null,
    hiding: boolean | null,
    hidden: boolean | null
}