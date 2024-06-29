import {Component} from '@angular/core';
import {QuickFiltersComponent} from "../shared/quick-filters/quick-filters.component";
import {ViewHeaderComponent} from "../shared/view-header/view-header.component";
import {NgScrollbar} from "ngx-scrollbar";
import {TeamCardComponent} from "../your-teams/team-card/team-card.component";
import {ChatCardComponent} from "./chat-card/chat-card.component";
import {Chat} from "../../shared/constants/chat";
import * as mockData from "./mock-chat.json";


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    QuickFiltersComponent,
    ViewHeaderComponent,
    NgScrollbar,
    TeamCardComponent,
    ChatCardComponent
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {

  data: Chat[] = mockData.chat;

}
