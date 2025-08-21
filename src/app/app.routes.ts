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
import { NewEventComponent } from './layout/new-event/new-event.component';
import { MyProductsComponent } from './layout/my-products/my-products.component';
import { AuthGuard } from './auth.guard';
import { MyEventsComponent } from './layout/my-events/my-events.component';
import { EventDetailsComponent } from './layout/event-details/event-details.component';
import { AgendaComponent } from './layout/agenda/agenda.component';
import { RoleGuard } from './role.guard';

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'signin', component: LoginComponent,  canActivate: []},
    {path: 'signup', component: RegisterComponent, canActivate: []},
    {path: 'home', component: HomeComponent, canActivate: []},
    {path: 'event-details', component: EventDetailsComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['EVENT_ORGANIZER', 'SERVICE_PRODUCT_PROVIDER', 'ADMIN'] }},
    {path: 'chat', component: ChatComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['EVENT_ORGANIZER', 'SERVICE_PRODUCT_PROVIDER', 'ADMIN'] }},
    {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['EVENT_ORGANIZER', 'SERVICE_PRODUCT_PROVIDER', 'ADMIN'] }},
    {path: 'calendar',component: MyEventsComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['EVENT_ORGANIZER', 'SERVICE_PRODUCT_PROVIDER', 'ADMIN'] }},
    {path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['EVENT_ORGANIZER', 'SERVICE_PRODUCT_PROVIDER', 'ADMIN'] }},
    {path: 'new-event-type', component: NewEventTypeComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN'] }},
    {path: 'new-service', component: NewServiceComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['SERVICE_PRODUCT_PROVIDER', 'ADMIN'] }},
    {path: 'new-product', component: NewProductComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['SERVICE_PRODUCT_PROVIDER', 'ADMIN'] }}, 
    {path: 'my-services', component: MyServicesComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['SERVICE_PRODUCT_PROVIDER', 'ADMIN'] }},
    {path: 'my-products', component: MyProductsComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['SERVICE_PRODUCT_PROVIDER', 'ADMIN'] }},
    {path: 'new-event', component: NewEventComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['EVENT_ORGANIZER', 'ADMIN'] }},
    {path: 'my-events', component: MyEventsComponent, canActivate: [AuthGuard, RoleGuard] , data: { roles: ['EVENT_ORGANIZER', 'ADMIN'] }},
    {path: 'agenda', component: AgendaComponent},
    {path: '**', redirectTo: 'home'},
];
