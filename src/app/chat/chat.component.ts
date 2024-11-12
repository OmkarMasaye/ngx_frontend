import { Component } from '@angular/core';
import { NbCardModule, NbChatModule, NbLayoutModule, NbChatOptions } from '@nebular/theme';
import { ChatService } from './chat.service';
import { LayoutComponent } from '../layout/layout.component';
import { CommonModule } from '@angular/common';

interface File {
  src: string;
  type: string;
  icon?: string; // icon is optional
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [NbChatModule, NbCardModule, NbLayoutModule, LayoutComponent, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
  providers: [
    ChatService,
    { provide: NbChatOptions, useValue: { messageGoogleMapKey: 'YOUR_GOOGLE_MAPS_KEY' } },
  ],
})
export class ChatComponent {
  messages: any[];

  constructor(protected chatService: ChatService) {
    this.messages = this.chatService.loadMessages();
  }

  sendMessage(event: any) {
    const files = !event.files ? [] : event.files.map((file: File) => ({
      url: file.src,
      type: file.type,
      icon: 'nb-compose',
    }));

    this.messages.push({
      text: event.message,
      date: new Date(),
      reply: true,
      type: files.length ? 'file' : 'text',
      files: files,
      user: {
        name: 'John Doe',
        avatar: 'https://i.gifer.com/no.gif',
      },
    });

    const botReply = this.chatService.reply(event.message);
    if (botReply) {
      setTimeout(() => { this.messages.push(botReply); }, 500);
    }
  }
}
