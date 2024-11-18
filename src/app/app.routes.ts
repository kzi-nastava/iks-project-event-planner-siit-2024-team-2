import { Routes } from '@angular/router';
import { HomeComponent } from './layout/home/home.component';
import { ChatComponent } from './layout/chat/chat.component';
import { ProfileComponent } from './layout/profile/profile.component';
import { NotificationsComponent } from './layout/notifications/notifications.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'chat', component: ChatComponent},
    {path: 'profile', component: ProfileComponent},
    {path: 'notifications', component: NotificationsComponent},
];
