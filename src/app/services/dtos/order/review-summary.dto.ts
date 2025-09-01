import { SafeHtml } from "@angular/platform-browser";

export interface ReviewSummaryDto {
    grade: number | null,
    comment: string | null,
    createdAt: Date,
    creatorName: string | null,
    creatorEmail: string | null,
    creatorProfilePicture: string | null,
    formattedComment: SafeHtml | null,
}
    

/*
public class ReviewSummaryDto {
    private double grade;
    private String comment;
    private Instant createdAt;
    private String creatorName;
    private String creatorEmail;
    private String creatorProfilePicture;
}
*/