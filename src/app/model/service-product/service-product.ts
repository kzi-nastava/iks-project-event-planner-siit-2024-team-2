import { EventType } from "../event/event-type";
import { ServiceProductProvider } from "../user/service-product-provider";
import { ServiceProductCategory } from "./service-product-category";

export interface ServiceProduct {
    id: number;
    name: string | null;
    description: string | null;
    category: ServiceProductCategory | null;
    available: boolean | null;
    visible: boolean | null;
    price: number | null;
    discount: number | null;
    images: string[] | null;
    availableEventTypes: EventType[] | null;
    serviceProductProvider: ServiceProductProvider | null;
    dtype: "Service" | "Product" | null;
}

