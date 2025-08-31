import { ReviewStatus } from "../../../model/utils/review-status";
import { ReviewType } from "./review-type";

export interface ReviewDto {
    grade: number,
    comment: string | null,
    userId: number,
    reviewStatus: ReviewStatus,
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