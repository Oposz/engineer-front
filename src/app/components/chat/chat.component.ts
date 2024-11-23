import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {QuickFiltersComponent, SortingMode} from "../shared/quick-filters/quick-filters.component";
import {ViewHeaderComponent} from "../shared/view-header/view-header.component";
import {NgScrollbar} from "ngx-scrollbar";
import {TeamCardComponent} from "../your-teams/team-card/team-card.component";
import {ChatCardComponent} from "./chat-card/chat-card.component";
import {Chat} from "../../shared/constants/chat";
import {HttpService} from "../../shared/service/http.service";
import {LocalStorageService} from "../../shared/service/local-storage.service";


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
  styleUrl: './chat.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent implements OnInit {

  chats: Chat[] = [];
  filteredChats: Chat[] = [];

  constructor(
    private readonly httpService: HttpService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly localStorage: LocalStorageService
  ) {
  }

  ngOnInit() {
    this.httpService.get('chats').subscribe((dat: Chat[]) => {
      this.chats = dat;
      this.filteredChats = this.chats;
      this.changeDetectorRef.detectChanges();
    })
  }

  sortChats(sortingMode: SortingMode) {
    this.chats.sort((a, b) => {
      const getUsersName = (chat: Chat) => {
        const loggedUserId = this.localStorage.getItem('uniteam-user-id');
        return chat.users
          .filter(user => user.id !== loggedUserId)
          .map(user => `${user.name} ${user.lastName}`)
          .join(', ');
      };

      const nameA = a.name || getUsersName(a);
      const nameB = b.name || getUsersName(b);

      if (sortingMode === SortingMode.ASCENDING) {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });

    this.changeDetectorRef.detectChanges();
  }

  searchForChat(searchValue: string) {
    if (!searchValue) {
      this.filteredChats = this.chats;
      return;
    }

    const searchLower = searchValue.toLowerCase();

    this.filteredChats = this.chats.filter(chat => {
      if (chat.name) {
        return chat.name.includes(searchValue);
      }

      const getUsersName = (chat: Chat) => {
        const loggedUserId = this.localStorage.getItem('uniteam-user-id');
        return chat.users
          .filter(user => user.id !== loggedUserId)
          .map(user => `${user.name} ${user.lastName}`.toLowerCase())
          .join(', ');
      };

      const usersName = getUsersName(chat);
      return usersName.includes(searchLower);
    });

    this.changeDetectorRef.detectChanges();
  }

}
