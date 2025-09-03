import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { UserContextService } from '../../services/utils/user-context.service';
import { ChatService } from '../../services/communication/chat.service';
import { ChatDto } from '../../services/dtos/communication/chat.dto';
import { ChatStatus } from '../../model/utils/chat-status';
import { Chat } from '../../model/communication/chat';
import { FormsModule } from '@angular/forms';
import { ChatMessageDto } from '../../services/dtos/communication/chat-message.dto';
import { ChatMessageService } from '../../services/communication/chat-message.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ MatSidenavModule, CommonModule, FormsModule ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  readonly userContextService = inject(UserContextService);
  readonly chatService = inject(ChatService);
  readonly chatMessageService = inject(ChatMessageService);

  myChats: Chat[] = [];
  chatFriendId: number | null = null;
  chat: Chat | null = null;
  newMessage = '';

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
          this.chat = chat;
        });
      }
      else this.chat = chat;
    });
  }

  sendMessage() {
    if (this.newMessage && this.chatFriendId && this.chat) {
      const chatMessage: ChatMessageDto = {
        text: this.newMessage,
        toUserId: this.chatFriendId,
        seen: false
      }
    this.chatMessageService.sendMessage(chatMessage).subscribe(message => {
      if (!this.chat) return;
      this.chatService.sendMessage(this.chat.id, message).subscribe(chat => {
        this.chat = chat;
        this.newMessage = '';
      });
    });
    }
  }
}
