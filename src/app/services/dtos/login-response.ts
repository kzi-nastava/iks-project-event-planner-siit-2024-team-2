export interface LoginResponse {
    jwt: string;
    id: number;
    email: string; 
    role: 'EVENT_ORGANIZER' | 'SERVICE_PRODUCT_PROVIDER' | 'ADMIN';
}