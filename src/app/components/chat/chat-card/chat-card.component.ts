import {Component, Input, OnInit} from '@angular/core';
import {Chat} from "../../../shared/constants/chat";
import {NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";
import {PhotoComponent} from "../../shared/photo/photo.component";
import {LocalStorageService} from "../../../shared/service/local-storage.service";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'app-chat-card',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink,
    PhotoComponent,
    MatTooltip
  ],
  templateUrl: './chat-card.component.html',
  styleUrl: './chat-card.component.scss'
})
export class ChatCardComponent implements OnInit {

  @Input({required: true})
  chat!: Chat;

  chatName: string = ''

  constructor(private readonly localStorage: LocalStorageService) {
  }

  ngOnInit() {
    this.getChatName();
  }

  getNameOfUser(userId: string) {
    const userName = this.chat.users.find((user) => user.id === userId)?.name
    if (!userName) return
    return this.capitalizeWord(userName);
  }

  private getChatName() {
    if (this.chat.name) {
      this.chatName = this.chat.name
      return;
    }

    const loggedUserId = this.currentlyLoggedUserId();
    if (!loggedUserId) return
    const otherUsers = this.chat.users.filter((user) => user.id !== loggedUserId)
    this.chatName = otherUsers
      .map((user) => {
        const firstName = this.capitalizeWord(user.name);
        const lastName = this.capitalizeWord(user.lastName);
        return `${firstName} ${lastName}`;
      })
      .join(', ');
  }

  private currentlyLoggedUserId() {
    return this.localStorage.getItem('uniteam-user-id')
  }

  private capitalizeWord(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }

}
