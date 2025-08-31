import { User } from "../user/user";
import { ReviewStatus } from "../utils/review-status";
import { ServiceProduct } from "./service-product";

export interface ServiceProductReview {
    id: number,
    grade: number | null,
    comment: string | null,
    serviceProduct: ServiceProduct,
    user: User | null,
    reviewStatus: ReviewStatus,
    createdAt: Date,
    hiding: boolean,
    hidden: boolean
}
/*
public class ServiceProductReviewDto {
    private long id;
    private int grade;
    private String comment;
    private ServiceProductDto serviceProduct;
    private BaseUserDto user;
    private ReviewStatus reviewStatus;
}
*/