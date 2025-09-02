import { Component, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { UserContextService } from '../../services/utils/user-context.service';
import { ChatService } from '../../services/communication/chat.service';
import { ChatDto } from '../../services/dtos/communication/chat.dto';
import { ChatStatus } from '../../model/utils/chat-status';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    MatSidenavModule,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  readonly userContextService = inject(UserContextService);
  readonly chatService = inject(ChatService);
  chatFriendId: number | null = null;

  ngOnInit(): void {
    this.chatFriendId = this.userContextService.getUserId();
    if (this.chatFriendId == null) {
      console.error('ChatComponent: userId is null');
      return
    }
    this.chatService.getMineUser2Id(this.chatFriendId).subscribe(chat => {
      if (!chat) {
        const chat: ChatDto = {
          toId: Number(this.chatFriendId),
          messageIds: [],
          status: ChatStatus.ALL_SEEN
        }
        this.chatService.add(chat).subscribe(chat => {
          console.log('Chat created', chat);
        });
      }
    })
  }
}
