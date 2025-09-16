import { Routes } from '@angular/router';
import { HomeComponent } from './layout/home/home.component';
import { ChatComponent } from './layout/communication/chat/chat.component';
import { ProfileComponent } from './layout/user/profile/profile.component';
import { NotificationsComponent } from './layout/communication/notifications/notifications.component';
import { NewServiceComponent } from './layout/service-product/new-service/new-service.component';
import { NewProductComponent } from './layout/service-product/new-product/new-product.component';
import { MyServicesComponent } from './layout/service-product/my-services/my-services.component';
import { LoginComponent } from './layout/auth/login/login.component';
import { RegisterComponent } from './layout/auth/register/register.component';
import { NewEventTypeComponent } from './layout/event/new-event-type/new-event-type.component';
import { NewEventComponent } from './layout/event/new-event/new-event.component';
import { MyProductsComponent } from './layout/service-product/my-products/my-products.component';
import { AuthGuard } from './auth.guard';
import { MyEventsComponent } from './layout/event/my-events/my-events.component';
import { EventDetailsComponent } from './layout/event/event-details/event-details.component';
import { AgendaComponent } from './layout/event/agenda/agenda.component';
import { RoleGuard } from './role.guard';
import { MyEventTypesComponent } from './layout/event/my-event-types/my-event-types.component';
import { NewCategoryComponent } from './layout/service-product/new-category/new-category.component';
import { AllCategoriesComponent } from './layout/service-product/all-categories/all-categories.component';
import { PriceListComponent } from './layout/service-product/price-list/price-list.component';
import { AcceptInvitationComponent } from './layout/event/accept-invitation/accept-invitation.component';
import { UserRole } from './dto/user/user-role';
import { SpDetailsComponent } from './layout/service-product/sp-details/sp-details-component';
import { UserReportsComponent } from './layout/user/user-reports/user-reports.component';
import { CalendarComponent } from './layout/user/calendar/calendar.component';
import { AdminReviewsComponent } from './layout/review/admin-reviews/admin-reviews.component';
import { BudgetComponent } from './layout/event/budget/budget.component';
import { BookingsComponent } from './layout/service-product/bookings/bookings.component';

const ALL_AUTHENTICATED: UserRole[] = ['AUTHENTICATED', 'EVENT_ORGANIZER', 'SERVICE_PRODUCT_PROVIDER', 'ADMIN'];

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'signin', component: LoginComponent,  canActivate: []},
    {path: 'signup', component: RegisterComponent, canActivate: []},
    {path: 'home', component: HomeComponent, canActivate: []},
    {path: 'sp-details', component: SpDetailsComponent, canActivate: []},
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
    {path: 'bookings', component: BookingsComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['SERVICE_PRODUCT_PROVIDER'] }},
    {path: 'new-event', component: NewEventComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['EVENT_ORGANIZER'] }},
    {path: 'my-events', component: MyEventsComponent, canActivate: [AuthGuard, RoleGuard] , data: { roles: ['EVENT_ORGANIZER'] }},
    {path: 'all-categories', component: AllCategoriesComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN'] }},
    {path: 'new-category', component: NewCategoryComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN'] }},
    {path: 'user-reports', component: UserReportsComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN'] }},
    {path: 'admin-reviews', component: AdminReviewsComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN'] }},
    {path: 'price-list', component: PriceListComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['SERVICE_PRODUCT_PROVIDER'] }},
    {path: 'budget', component: BudgetComponent, canActivate: [AuthGuard, RoleGuard] , data: { roles: ['EVENT_ORGANIZER'] }},
    {path: 'agenda', component: AgendaComponent},
    {path: 'accept-invitation', component: AcceptInvitationComponent, canActivate: []},
    {path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ALL_AUTHENTICATED }},
    {path: '**', redirectTo: 'home'},
];
