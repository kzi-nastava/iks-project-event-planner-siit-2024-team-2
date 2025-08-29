import { UserRole } from "./user-role";

export interface User {
    firstName: string;
    lastName: string;
    email: string;
    image: string;
    phoneNumber: string;
    address: string;
    favoriteEvents: any[];
    favoriteServices: any[];
    upcomingEvents: any[];
    // Additional properties for SERVICE_PRODUCT_PROVIDER
    companyName: string;
    companyDescription: string;

    serviceCategories: any[];
    eventTypes: any[];
    selectedEventTypes: any[];
    userRole: UserRole;
}