import { User } from "../../services/dtos/user/user";
import { EventType } from "../event/event-type";
import { ServiceProductCategory } from "./service-product-category";

export interface ServiceProduct {
    id: number | null;
    name: string | null;
    description: string | null;
    category: ServiceProductCategory | null;
    available: boolean | null;
    visible: boolean | null;
    price: number | null;
    discount: number | null;
    images: string[] | null;
    availableEventTypes: EventType[] | null;
    serviceProductProvider: User | null;
    dtype: string | null;
}