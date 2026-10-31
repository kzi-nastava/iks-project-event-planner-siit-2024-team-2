import { Event } from "../event/event";
import { Review } from "./review";

export interface EventReview extends Review {
    event: Event
}