import { ReviewStatus } from "../../../../model/utils/review-status";

export interface ServiceProductReviewDto {
    grade: number,
    comment: string | null,
    serviceProductId: number,
    userId: number,
    reviewStatus: ReviewStatus
}

/*
public class ServiceProductReviewNoIdDto {
    private int grade;
    private String comment;
    private long serviceProductId;
    private long userId;
    private ReviewStatus reviewStatus;
}
*/