export interface UserReport {
    id: number;
    reporter: any;
    reported: any;
    approvedAt: Date | null;
    reason: string;
}