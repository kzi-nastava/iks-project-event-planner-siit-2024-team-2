import { UserRole } from "../user/user-role";

export interface LoginResponse {
    jwt: string;
    id: number;
    email: string; 
    role: UserRole;
    suspendedAt: Date | null;
}