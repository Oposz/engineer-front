import {Component} from '@angular/core';
import {ViewHeaderComponent} from "../../shared/view-header/view-header.component";
import {BreadcrumbsComponent} from "../../shared/breadcrumbs/breadcrumbs.component";
import {RouterLink} from "@angular/router";
import {NgScrollbar} from "ngx-scrollbar";
import {UniversityCardComponent} from "../../universities/university-card/university-card.component";
import * as mockData from "./mock-messages.json";
import {Message} from "../../../shared/constants/chat";
import {NgClass, NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-conversation-view',
  standalone: true,
  imports: [
    ViewHeaderComponent,
    BreadcrumbsComponent,
    RouterLink,
    NgScrollbar,
    UniversityCardComponent,
    NgClass,
    NgOptimizedImage
  ],
  templateUrl: './conversation-view.component.html',
  styleUrl: './conversation-view.component.scss'
})
export class ConversationViewComponent {

  conversationMessages: Message[] = mockData.messages

}
