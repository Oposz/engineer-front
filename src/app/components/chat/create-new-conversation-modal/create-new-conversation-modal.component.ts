import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {MatDialogClose, MatDialogRef} from "@angular/material/dialog";
import {NgOptimizedImage} from "@angular/common";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {ModalOutcome} from "../../../shared/constants/modalOutcome";
import {NewPositionComponent} from "../../add-new-project/new-position/new-position.component";
import {NgScrollbar} from "ngx-scrollbar";
import {HttpService} from "../../../shared/service/http.service";
import {User} from "../../../shared/constants/user";
import {MatOption} from "@angular/material/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {debounceTime, distinctUntilChanged, map} from "rxjs";
import {Router} from "@angular/router";
import {Chat} from "../../../shared/constants/chat";
import {HttpErrorResponse} from "@angular/common/http";
import {SnackbarComponent, SnackbarData} from "../../shared/snackbar/snackbar.component";
import {SnackbarService} from "../../../shared/service/snackbar.service";

@Component({
  selector: 'app-create-new-conversation-modal',
  standalone: true,
  imports: [
    MatDialogClose,
    NgOptimizedImage,
    ReactiveFormsModule,
    NewPositionComponent,
    NgScrollbar,
    MatOption
  ],
  templateUrl: './create-new-conversation-modal.component.html',
  styleUrl: './create-new-conversation-modal.component.scss'
})
export class CreateNewConversationModalComponent implements OnInit {

  readonly dialogRef = inject(MatDialogRef<CreateNewConversationModalComponent>);

  users: User[] = [];
  filteredUsers: User[] = [];
  newConversationUsers: string[] = [];

  search = new FormControl<string>('');

  protected readonly ModalOutcome = ModalOutcome;

  constructor(private readonly httpService: HttpService,
              private readonly destroyRef: DestroyRef,
              private readonly router: Router,
              private readonly snackbarService: SnackbarService
  ) {
  }

  ngOnInit() {
    this.fetchAllUsersExcludingMe();
    this.observeUserFilter();
  }

  adjustUserToConversation(userId: string, checkboxEvent: Event) {
    const checkboxValue = checkboxEvent.target as HTMLInputElement
    if (checkboxValue.checked) {
      this.newConversationUsers.push(userId);
      return
    }

    const userIdIndex = this.newConversationUsers.indexOf(userId)
    if (userIdIndex === -1) return
    this.newConversationUsers.splice(userIdIndex, 1)
  }

  startNewConversation() {
    this.httpService.post('chats/new', {users: this.newConversationUsers}).subscribe({
      next: (newlyCreatedChat: Chat) => {
        this.dialogRef.close(ModalOutcome.SUCCESS)
        this.router.navigate(['/chats', newlyCreatedChat.id])
      },
      error: (e: HttpErrorResponse) => {
        this.handleError(e);
      }
    })
  }

  private handleError(e: HttpErrorResponse) {
    let data: SnackbarData = {
      message: 'Ups! Coś poszło nie tak :(',
      variant: "error",
      closeButton: true
    }
    this.snackbarService.snackbarFromComponent(SnackbarComponent, data)
  }

  private observeUserFilter() {
    this.search.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((searchValue) => {
      if (!searchValue) {
        this.filteredUsers = this.users;
        return;
      }
      const searchLower = searchValue.toLowerCase().trim();
      this.filteredUsers = this.users.filter((user) =>
        user.name.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    })
  }

  fetchAllUsersExcludingMe() {
    const currentUserId = localStorage.getItem('uniteam-user-id');

    this.httpService.get('user/all').pipe(
      map((users: User[]) => users.filter(user => user.id !== currentUserId))
    ).subscribe((users: User[]) => {
      this.users = users;
      this.filteredUsers = this.users;
    })
  }
}
