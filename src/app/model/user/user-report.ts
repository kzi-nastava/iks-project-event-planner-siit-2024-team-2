import { User } from "../../services/dtos/user/user";

export interface UserReport {
    id: number | null,
    reporter: User | null,
    reported: User | null,
    approvedAt: Date | null,
    reason: string | null,
    createdAt: Date | null,
    hiding: boolean | null,
    hidden: boolean | null
}