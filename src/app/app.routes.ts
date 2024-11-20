import { Routes } from '@angular/router';
import { HomeComponent } from './layout/home/home.component';
import { ChatComponent } from './layout/chat/chat.component';
import { ProfileComponent } from './layout/profile/profile.component';
import { NotificationsComponent } from './layout/notifications/notifications.component';
import { NewServiceComponent } from './layout/new-service/new-service.component';
import { MyServicesComponent } from './layout/my-services/my-services.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'chat', component: ChatComponent},
    {path: 'profile', component: ProfileComponent},
    {path: 'notifications', component: NotificationsComponent},
    {path: 'new-service', component: NewServiceComponent},
    {path: 'my-services', component: MyServicesComponent}
];
