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
<<<<<<< HEAD
    serviceProductProvider: User | null;
=======
    serviceProductProvider: ServiceProductProvider | null;
>>>>>>> develop
    dtype: string | null;
}