import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ViewHeaderComponent} from "../../shared/view-header/view-header.component";
import {BreadcrumbsComponent} from "../../shared/breadcrumbs/breadcrumbs.component";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {NgScrollbar} from "ngx-scrollbar";
import {UniversityCardComponent} from "../../universities/university-card/university-card.component";
import {NgClass, NgOptimizedImage} from "@angular/common";
import {LoaderComponent} from "../../shared/loader/loader.component";
import {HttpService} from "../../../shared/service/http.service";
import {take} from "rxjs";
import {Chat} from "../../../shared/constants/chat";
import {HttpErrorResponse} from "@angular/common/http";
import {SnackbarComponent, SnackbarData} from "../../shared/snackbar/snackbar.component";
import {SnackbarService} from "../../../shared/service/snackbar.service";
import {LocalStorageService} from "../../../shared/service/local-storage.service";

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
    NgOptimizedImage,
    LoaderComponent
  ],
  templateUrl: './conversation-view.component.html',
  styleUrl: './conversation-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConversationViewComponent implements OnInit {

  fetching = true;
  conversationId = ''
  chat!: Chat
  chatName: string = ''
  loggedUserId = ''

  constructor(
    private readonly httpService: HttpService,
    private readonly route: ActivatedRoute,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly snackbarService: SnackbarService,
    private readonly localStorageService: LocalStorageService
  ) {
  }

  ngOnInit() {
    this.getConversationId();
    this.fetchConversation();
    this.loggedUserId = this.localStorageService.getItem('uniteam-user-id') ?? ''
  }

  private fetchConversation() {
    this.httpService.get(`chats/${this.conversationId}`).subscribe({
      next: (chat: Chat) => {
        this.chat = chat;
        this.setConversationName();
        this.fetching = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (e: HttpErrorResponse) => {
        this.handleError(e);
      }
    })
  }

  private getConversationId() {
    this.route.params.pipe(
      take(1)
    ).subscribe((params) => {
      this.conversationId = params['id'];
    })
  }

  private setConversationName() {
    if (this.chat.name) {
      this.chatName = this.chat.name;
      return;
    }
    this.chatName = this.chat.users.map((user) => {
      const firstName = this.capitalizeWord(user.name);
      const lastName = this.capitalizeWord(user.lastName);
      return `${firstName} ${lastName}`;
    })
      .join(', ');
  }

  private handleError(e: HttpErrorResponse) {
    let snackbarData: SnackbarData = {
      message: 'Ups! Coś poszło nie tak :(, odśwież stronę i spróbuj ponownie',
      variant: "error",
      closeButton: true
    }

    this.snackbarService.snackbarFromComponent(SnackbarComponent, snackbarData)
  }

  private capitalizeWord(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }
}
