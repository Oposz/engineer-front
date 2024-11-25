import {Component, inject, OnInit} from '@angular/core';
import {MatDialogClose, MatDialogRef} from "@angular/material/dialog";
import {NgOptimizedImage} from "@angular/common";
import {ModalOutcome} from "../../../../shared/constants/modalOutcome";
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {filter, fromEvent} from "rxjs";

@Component({
  selector: 'app-chat-new-name-modal',
  standalone: true,
  imports: [
    MatDialogClose,
    NgOptimizedImage,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './chat-new-name-modal.component.html',
  styleUrl: './chat-new-name-modal.component.scss'
})
export class ChatNewNameModalComponent implements OnInit {

  readonly dialogRef = inject(MatDialogRef<ChatNewNameModalComponent>)

  newName = new FormControl<string>('', [Validators.required, Validators.minLength(2)])

  protected readonly ModalOutcome = ModalOutcome;

  ngOnInit() {
    fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(
        filter(event => event.key === 'Escape')
      )
      .subscribe(() => {
        this.dialogRef.close({
          result: ModalOutcome.ABANDON
        });
      });
  }

  submitNameChange() {
    this.dialogRef.close({result: ModalOutcome.SUCCESS, data: {name: this.newName.value}})
  }
}
