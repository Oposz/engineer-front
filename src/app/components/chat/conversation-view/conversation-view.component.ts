import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {ViewHeaderComponent} from "../../shared/view-header/view-header.component";
import {BreadcrumbsComponent} from "../../shared/breadcrumbs/breadcrumbs.component";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {NgScrollbar} from "ngx-scrollbar";
import {UniversityCardComponent} from "../../universities/university-card/university-card.component";
import {NgClass, NgOptimizedImage} from "@angular/common";
import {LoaderComponent} from "../../shared/loader/loader.component";
import {HttpService} from "../../../shared/service/http.service";
import {catchError, map, of, switchMap, take} from "rxjs";
import {Chat, Message} from "../../../shared/constants/chat";
import {HttpErrorResponse} from "@angular/common/http";
import {SnackbarComponent, SnackbarData} from "../../shared/snackbar/snackbar.component";
import {SnackbarService} from "../../../shared/service/snackbar.service";
import {LocalStorageService} from "../../../shared/service/local-storage.service";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MessagesGatewayService} from "./messages-gateway.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {MatMenu, MatMenuTrigger} from "@angular/material/menu";
import {ChatNewNameModalComponent} from "./chat-new-name-modal/chat-new-name-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {ModalOutcome} from "../../../shared/constants/modalOutcome";


type ModalOutComeWithData = {
  result: ModalOutcome,
  data?: {
    name: string
  }
}

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
    LoaderComponent,
    ReactiveFormsModule,
    MatMenu,
    MatMenuTrigger
  ],
  templateUrl: './conversation-view.component.html',
  styleUrl: './conversation-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConversationViewComponent implements OnInit, OnDestroy {

  readonly dialog = inject(MatDialog);
  destroyRef = inject(DestroyRef);

  @ViewChild('scroll')
  scrollContainer!: any

  fetching = true;
  conversationId = '';
  chat!: Chat;
  chatName: string = '';
  loggedUserId = '';

  chatInput = new FormControl<string>('');

  constructor(
    private readonly httpService: HttpService,
    private readonly route: ActivatedRoute,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly snackbarService: SnackbarService,
    private readonly localStorageService: LocalStorageService,
    private readonly messagesGatewayService: MessagesGatewayService
  ) {
  }

  ngOnInit() {
    this.getConversationId();
    this.fetchConversation();
    this.markAllMessagesAsSeen();
    this.loggedUserId = this.localStorageService.getItem('uniteam-user-id') ?? '';
    this.observeNewMessages();
    this.connectMsgSocket();
  }

  sendMessage() {
    const message = {
      message: this.chatInput.value ?? '',
      chatId: this.chat.id,
      new: true
    }

    this.httpService.post('messages/new', message).subscribe({
      next: (message: Message) => {
        this.chat.messages.push(message);
        this.chatInput.reset();
        this.changeDetectorRef.detectChanges();
        this.scrollToBottomOfChat();
      },
      error: (e: HttpErrorResponse) => {
        this.handleError(e);
      }
    })

  }

  observeNewMessages() {
    this.messagesGatewayService.fetchNewMessages$.pipe(
      switchMap(() => this.httpService.get(`messages/unseen/${this.conversationId}`)),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((messages: Message[]) => {
      this.chat.messages.push(...messages);
      this.changeDetectorRef.detectChanges();
      this.scrollToBottomOfChat();
    })
  }

  changeChatName() {
    const dialog = this.dialog.open(ChatNewNameModalComponent, {width: '500px'})
    dialog.afterClosed().pipe(
      switchMap((results: ModalOutComeWithData) => this.changeChatNameInDb$(results))
    ).subscribe({
      next: (results) => {
        if (!results?.name) return;
        this.chatName = results.name
        this.changeDetectorRef.detectChanges();
      },
      error: (e: HttpErrorResponse) => {
        this.handleError(e);
      }
    })
  }

  private changeChatNameInDb$(results: ModalOutComeWithData) {
    if (results.result !== ModalOutcome.SUCCESS) {
      return of(null);
    }
    const newName = results.data?.name;
    return this.httpService.patch(`chats/name/${this.conversationId}`, {name: results.data?.name}).pipe(
      map(() => ({success: true, name: newName})),
      catchError(error => {
        return of({success: false, error, name: newName});
      })
    )
  }

  private connectMsgSocket() {
    this.messagesGatewayService.connect(this.loggedUserId).then(
      () => this.messagesGatewayService.setupNewMessagesListener()
    )
  }

  private fetchConversation() {
    this.httpService.get(`chats/${this.conversationId}`).subscribe({
      next: (chat: Chat) => {
        this.chat = chat;
        this.setConversationName();
        this.fetching = false;
        this.changeDetectorRef.detectChanges();
        this.scrollToBottomOfChat();
      },
      error: (e: HttpErrorResponse) => {
        this.handleError(e);
      }
    })
  }

  private scrollToBottomOfChat() {
    this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight
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

  private markAllMessagesAsSeen() {
    this.httpService.patch(`chats/seen/${this.conversationId}`, {}).subscribe()
  }

  ngOnDestroy() {
    this.markAllMessagesAsSeen();
  }
}
