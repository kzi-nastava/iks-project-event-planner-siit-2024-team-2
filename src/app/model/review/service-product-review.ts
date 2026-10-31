import { ServiceProduct } from "../service-product/service-product";
import { Review } from "./review";

export interface ServiceProductReview extends Review {
    serviceProduct: ServiceProduct
}