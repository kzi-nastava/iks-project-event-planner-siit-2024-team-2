import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { UserContextService } from '../../services/utils/user-context.service';
import { ChatService } from '../../services/communication/chat.service';
import { ChatDto } from '../../dto/communication/chat.dto';
import { ChatStatus } from '../../model/utils/chat-status';
import { Chat } from '../../model/communication/chat';
import { FormsModule } from '@angular/forms';
import { ChatMessageDto } from '../../dto/communication/chat-message.dto';
import { ChatMessageService } from '../../services/communication/chat-message.service';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../../model/user/user';
import { MatIconModule } from "@angular/material/icon";
import { UserService } from '../../services/user/user.service';
import { ToastService } from '../../services/utils/toast-service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [MatSidenavModule, CommonModule, FormsModule, MatButtonModule, MatIconModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  readonly userContextService = inject(UserContextService);
  readonly chatService = inject(ChatService);
  readonly chatMessageService = inject(ChatMessageService);
  readonly userService = inject(UserService);
  readonly toastService = inject(ToastService);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);

  myChats: Chat[] = [];
  chatFriendId: number | null = null;
  chatFriend: User | null = null;
  chat: Chat | null = null;
  newMessage = '';
  myId = Number(localStorage.getItem('userId'))

  ngOnInit(): void {
    this.chatService.getAllMyChats({ page: 0, size: -1 }).subscribe(response => {
      this.myChats = response.content;
      this.route.queryParams.subscribe(params => {
        const chatId = params['id'];
        if (chatId) {
          const existingChat = this.myChats.find(chat => chat.id === Number(chatId))
          if (existingChat)
            this.selectChat(existingChat);
        }
      });
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
            this.chat.messages.sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
          });
        }
        else {
          this.chat = chat;
          this.chat.messages.sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
        }
      });
    }
  }
  // 2. with someone you've chatted with before (you found them on chat sidebar)
  selectChat(chat: Chat) {
    this.chat = chat;
    this.chat.messages.sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
    // find a user who is chatting with you
    if (chat.user1.id === this.myId) {
      this.chatFriend = chat.user2;
      this.chatFriendId = chat.user2.id;
    }
    else {
      this.chatFriend = chat.user1;
      this.chatFriendId = chat.user1.id;
    }
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { id: this.chat.id },
      queryParamsHandling: 'merge'
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
        this.myChats.unshift(this.myChats.splice(this.myChats.indexOf(this.chat), 1)[0]);
      });
    });
    }
  }

  canBlockUser() {
    return this.chatFriendId && this.chat;
  }
  hasBlockedUser() {
    if (!this.chat) return false;
    const isUser1 = this.chat.user1.id === this.myId;
    return isUser1 ? this.chat.user1BlockedUser2 : this.chat.user2BlockedUser1;
  }
  bothBlocked() {
    if (!this.chat) return false;
    return this.chat.user1BlockedUser2 && this.chat.user2BlockedUser1;
  }
  chatBlocked() {
    if (!this.chat) return false;
    return this.chat.user1BlockedUser2 || this.chat.user2BlockedUser1;
  }

  toggleBlock() {
    const requestChat = this.chat;
    if (this.chatFriendId) {
      if (this.hasBlockedUser())
        this.userService.unblockUser(this.chatFriendId).subscribe({
          next: () => {
            this.toastService.show('User unblocked', 2000);
            if (requestChat) {
              if (requestChat.user1.id === this.myId)
                requestChat.user1BlockedUser2 = false;
              else
                requestChat.user2BlockedUser1 = false;
            }
            window.location.reload();
          },
          error: () => {
            this.toastService.show('Failed to unblock user', 2000);
          }
        });
      else
        this.userService.blockUser(this.chatFriendId).subscribe({
          next: () => {
            this.toastService.show('User blocked', 2000);
            if (requestChat) {
              if (requestChat.user1.id === this.myId)
                requestChat.user1BlockedUser2 = true;
              else
                requestChat.user2BlockedUser1 = true;
              requestChat.messages = [];
            }
          },
          error: () => {
            this.toastService.show('Failed to block user', 2000);
          }
        });
    }
  }
}
