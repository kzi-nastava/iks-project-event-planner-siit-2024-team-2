export interface NotificationDto {
    title: string,
    message: string,
    seen: boolean | undefined,
    dismissed: boolean | undefined,
    userId: number | undefined
}