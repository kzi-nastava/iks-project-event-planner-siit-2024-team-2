import { Routes } from '@angular/router';
import { HomeComponent } from './layout/home/home.component';
import { ChatComponent } from './layout/chat/chat.component';
import { ProfileComponent } from './layout/profile/profile.component';
import { NotificationsComponent } from './layout/notifications/notifications.component';
import { NewServiceComponent } from './layout/new-service/new-service.component';
import { MyServicesComponent } from './layout/my-services/my-services.component';
import { LoginComponent } from './layout/auth/login/login.component';
import { RegisterComponent } from './layout/auth/register/register.component';
import { NewEventTypeComponent } from './layout/new-event-type/new-event-type.component';

export const routes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: 'chat', component: ChatComponent},
    {path: 'profile', component: ProfileComponent},
    {path: 'notifications', component: NotificationsComponent},
    {path: 'new-service', component: NewServiceComponent},
    {path: 'new-event-type', component: NewEventTypeComponent},
    {path: 'my-services', component: MyServicesComponent},
    {path: 'signin', component: LoginComponent},
    {path: 'signup', component: RegisterComponent},
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: '**', redirectTo: 'home'}
];
