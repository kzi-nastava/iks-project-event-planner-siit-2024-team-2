import { InvitationErrorType } from "./invitation-error-type";

export interface InvitationErrorDto {
    type: InvitationErrorType | null,
    eventId: number | null
}