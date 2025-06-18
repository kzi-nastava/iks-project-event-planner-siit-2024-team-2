export interface User {
    firstName: string;
    lastName: string;
    email: string;
    profilePicture: string;
    phoneNumber: string;
    favoriteEvents: any[];
    favoriteServices: any[];
    upcomingEvents: any[];
    companyInfo: {
        name: string;
        description: string;
        location: string;
        phone: string;
        photos: string[];
    };
    serviceCategories: any[];
    eventTypes: any[];
    selectedEventTypes: any[];
    userType: 'OD' | 'PUP' | 'AK' | 'A';
}