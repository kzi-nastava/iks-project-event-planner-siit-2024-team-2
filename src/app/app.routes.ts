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
import { MyEventTypesComponent } from './layout/my-event-types/my-event-types.component';
import { NewCategoryComponent } from './layout/new-category/new-category.component';
import { AllCategoriesComponent } from './layout/all-categories/all-categories.component';
import { PriceListComponent } from './layout/price-list/price-list.component';

import { AcceptInvitationComponent } from './layout/accept-invitation/accept-invitation.component';
import { UserRole } from './services/dtos/user/user-role';
import { SpDetailsComponent } from './layout/sp-details/sp-details-component';
import { UserReportsComponent } from './layout/user-reports/user-reports.component';
import { CalendarComponent } from './layout/calendar/calendar.component';

const ALL_AUTHENTICATED: UserRole[] = ['AUTHENTICATED', 'EVENT_ORGANIZER', 'SERVICE_PRODUCT_PROVIDER', 'ADMIN'];

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'signin', component: LoginComponent,  canActivate: []},
    {path: 'signup', component: RegisterComponent, canActivate: []},
    {path: 'home', component: HomeComponent, canActivate: []},
    {path: 'sp-details', component: SpDetailsComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ALL_AUTHENTICATED }},
    {path: 'event-details', component: EventDetailsComponent, canActivate: []},
    {path: 'chat', component: ChatComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ALL_AUTHENTICATED }},
    {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ALL_AUTHENTICATED }},
    {path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ALL_AUTHENTICATED }},
    {path: 'new-event-type', component: NewEventTypeComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN'] }},
    {path: 'my-event-types', component: MyEventTypesComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN'] }},
    {path: 'new-service', component: NewServiceComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['SERVICE_PRODUCT_PROVIDER', 'ADMIN'] }},
    {path: 'new-product', component: NewProductComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['SERVICE_PRODUCT_PROVIDER', 'ADMIN'] }}, 
    {path: 'my-services', component: MyServicesComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['SERVICE_PRODUCT_PROVIDER', 'ADMIN'] }},
    {path: 'my-products', component: MyProductsComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['SERVICE_PRODUCT_PROVIDER', 'ADMIN'] }},
    {path: 'new-event', component: NewEventComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['EVENT_ORGANIZER', 'ADMIN'] }},
    {path: 'my-events', component: MyEventsComponent, canActivate: [AuthGuard, RoleGuard] , data: { roles: ['EVENT_ORGANIZER', 'ADMIN'] }},
    {path: 'all-categories', component: AllCategoriesComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN'] }},
    {path: 'new-category', component: NewCategoryComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN'] }},
    {path: 'user-reports', component: UserReportsComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN'] }},
    {path: 'price-list', component: PriceListComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['SERVICE_PRODUCT_PROVIDER'] }},
    {path: 'agenda', component: AgendaComponent},
    {path: 'accept-invitation', component: AcceptInvitationComponent, canActivate: []},
    {path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ALL_AUTHENTICATED }},
    {path: '**', redirectTo: 'home'},
];
