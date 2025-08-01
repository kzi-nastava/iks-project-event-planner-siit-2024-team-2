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
import { MyEventsComponent } from './layout/my-events/my-events.component';
import { EventDetailsComponent } from './layout/event-details/event-details.component';

export const routes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: 'chat', component: ChatComponent},
    {path: 'profile', component: ProfileComponent},
    {path: 'notifications', component: NotificationsComponent},
    {path: 'new-service', component: NewServiceComponent},
    {path: 'new-product', component: NewProductComponent}, 
    {path: 'new-event-type', component: NewEventTypeComponent},
    {path: 'my-services', component: MyServicesComponent},
    {path: 'my-products', component: MyProductsComponent},
    {path: 'signin', component: LoginComponent},
    {path: 'signup', component: RegisterComponent},
    {path: 'new-event', component: NewEventComponent},
    {path: 'my-events', component: MyEventsComponent},
    {path: 'event-details', component: EventDetailsComponent},
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: '**', redirectTo: 'home'}
];
