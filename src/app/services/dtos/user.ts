export interface User {
    firstName: string;
    lastName: string;
    email: string;
    profilePicture: string;
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
    userRole: 'EVENT_ORGANIZER' | 'SERVICE_PRODUCT_PROVIDER' | 'ADMIN';
}