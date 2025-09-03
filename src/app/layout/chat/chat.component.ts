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
import { ChatMessage } from '../../model/communication/chat-message';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../../model/user/user';


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ MatSidenavModule, CommonModule, FormsModule, MatButtonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  readonly userContextService = inject(UserContextService);
  readonly chatService = inject(ChatService);
  readonly chatMessageService = inject(ChatMessageService);

  myChats: Chat[] = [];
  chatFriendId: number | null = null;
  chatFriend: User | null = null;
  chat: Chat | null = null;
  newMessage = '';
  myId: Number = Number(localStorage.getItem('userId'))

  ngOnInit(): void {
    this.chatService.getAllMyChats({ page: 0, size: 10 }).subscribe(response => {
      this.myChats = response.content;
    });

    // With whom are you chatting?
    this.chatFriendId = this.userContextService.getUserId();
    // 1. with SPP or EO who you found on event- or sp-details page
    if (this.chatFriendId != null) {
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
  }
  // 2. with someone you've chatted with before (you found them on chat sidebar)
  selectChat(chat: Chat) {
    this.chat = chat;
    // find a user who is chatting with you
    if (chat.user1.id === this.myId) {
      this.chatFriend = chat.user2;
      this.chatFriendId = chat.user2.id;
    }
    else {
      this.chatFriend = chat.user1;
      this.chatFriendId = chat.user1.id;
    }
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
