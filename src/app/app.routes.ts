import { Routes } from '@angular/router';
import { HomeComponent } from './layout/home/home.component';
import { ChatComponent } from './layout/chat/chat.component';
import { ProfileComponent } from './layout/profile/profile.component';
import { NotificationsComponent } from './layout/notifications/notifications.component';
import { LoginComponent } from './layout/auth/login/login.component';
import { RegisterComponent } from './layout/auth/register/register.component';

export const routes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: 'chat', component: ChatComponent},
    {path: 'profile', component: ProfileComponent},
    {path: 'notifications', component: NotificationsComponent},
    {path: 'signin', component: LoginComponent},
    {path: 'signup', component: RegisterComponent},
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: '**', redirectTo: 'home'}
];
