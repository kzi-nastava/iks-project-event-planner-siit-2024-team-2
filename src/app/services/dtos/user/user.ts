import { Event } from "../../../model/event/event";
import { EventType } from "../../../model/event/event-type";
import { ServiceProduct } from "../../../model/service-product/service-product";
import { ServiceProductCategory } from "../../../model/service-product/service-product-category";
import { UserRole } from "./user-role";

export interface User {
    firstName: string;
    lastName: string;
    email: string;
    image: string;
    imageEncodedName: string;
    phoneNumber: string;
    address: string;
    favoriteEvents: Event[];
    favoriteServices: ServiceProduct[];
    upcomingEvents: Event[];
    // Additional properties for SERVICE_PRODUCT_PROVIDER
    companyName: string;
    companyDescription: string;

    serviceCategories: ServiceProductCategory[];
    eventTypes: EventType[];
    selectedEventTypes: EventType[];
    userRole: UserRole;
}