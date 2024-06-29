import {Component, Input} from '@angular/core';
import {Chat} from "../../../shared/constants/chat";
import {NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-chat-card',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink
  ],
  templateUrl: './chat-card.component.html',
  styleUrl: './chat-card.component.scss'
})
export class ChatCardComponent {

  @Input({required: true})
  chat!: Chat;

}
