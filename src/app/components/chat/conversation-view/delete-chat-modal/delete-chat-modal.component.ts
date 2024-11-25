import {Component, inject} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogClose} from "@angular/material/dialog";
import {NgOptimizedImage} from "@angular/common";
import {ModalOutcome} from "../../../../shared/constants/modalOutcome";
import {User} from "../../../../shared/constants/user";

@Component({
  selector: 'app-delete-chat-modal',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogClose,
    NgOptimizedImage
  ],
  templateUrl: './delete-chat-modal.component.html',
  styleUrl: './delete-chat-modal.component.scss'
})
export class DeleteChatModalComponent {

  readonly dialogData: { users: User[] } = inject(MAT_DIALOG_DATA);
  protected readonly ModalOutcome = ModalOutcome;
}
