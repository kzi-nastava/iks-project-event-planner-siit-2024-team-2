import { User } from "../user/user";
import { ReviewStatus } from "../utils/review-status";

export interface Review {
    id: number,
    grade: number | null,
    comment: string | null,
    user: User | null,
    reviewStatus: ReviewStatus,
    createdAt: Date,
    hiding: boolean,
    hidden: boolean,
    formattedComment: string | null,
}

/*
public class ReviewDto {
    private long id;
    private int grade;
    private String comment;
    private BaseUserDto user;
    private ReviewStatus reviewStatus;
    private Instant createdAt;
}
*/