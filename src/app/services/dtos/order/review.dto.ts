import { ReviewType } from "./review-type";

export interface ReviewDto {
    grade: number,
    comment: string | null,
    entityId: number,
    reviewType: ReviewType
}

/*
public class ReviewNoIdDto {
    private int grade;
    private String comment;
    private long userId;
    private ReviewStatus reviewStatus;
    private long entityId;
    private ReviewType reviewType;
}
*/