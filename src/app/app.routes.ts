import { Routes } from '@angular/router';
import { HomeComponent } from './layout/home/home.component';
import { ChatComponent } from './layout/chat/chat.component';
import { ProfileComponent } from './layout/profile/profile.component';
import { NotificationsComponent } from './layout/notifications/notifications.component';
import { NewServiceComponent } from './layout/new-service/new-service.component';
import { NewProductComponent } from './layout/new-product/new-product.component';
import { MyServicesComponent } from './layout/my-services/my-services.component';
import { LoginComponent } from './layout/auth/login/login.component';
import { RegisterComponent } from './layout/auth/register/register.component';
import { NewEventTypeComponent } from './layout/new-event-type/new-event-type.component';
import { CreateEventComponent } from './layout/create-event/create-event.component';
import { MyProductsComponent } from './layout/my-products/my-products.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: 'chat', component: ChatComponent, canActivate: [AuthGuard], data: { roles: ['EVENT_ORGANIZER', 'SERVICE_PRODUCT_PROVIDER', 'ADMIN'] }},
    {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard], data: { roles: ['EVENT_ORGANIZER', 'SERVICE_PRODUCT_PROVIDER', 'ADMIN'] }},
    {path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard], data: { roles: ['EVENT_ORGANIZER', 'SERVICE_PRODUCT_PROVIDER', 'ADMIN'] }},
    {path: 'new-event-type', component: NewEventTypeComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] }},
    {path: 'new-service', component: NewServiceComponent, canActivate: [AuthGuard], data: { roles: ['SERVICE_PRODUCT_PROVIDER', 'ADMIN'] }},
    {path: 'new-product', component: NewProductComponent, canActivate: [AuthGuard], data: { roles: ['SERVICE_PRODUCT_PROVIDER', 'ADMIN'] }}, 
    {path: 'my-services', component: MyServicesComponent, canActivate: [AuthGuard], data: { roles: ['SERVICE_PRODUCT_PROVIDER', 'ADMIN'] }},
    {path: 'my-products', component: MyProductsComponent, canActivate: [AuthGuard], data: { roles: ['SERVICE_PRODUCT_PROVIDER', 'ADMIN'] }},
    {path: 'signin', component: LoginComponent},
    {path: 'signup', component: RegisterComponent},
    {path: 'new-event', component: CreateEventComponent, canActivate: [AuthGuard], data: { roles: ['EVENT_ORGANIZER', 'ADMIN'] }},
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: '**', redirectTo: 'home'}
];
