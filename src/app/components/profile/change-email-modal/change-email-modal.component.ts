import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogClose, MatDialogRef} from "@angular/material/dialog";
import {NgOptimizedImage} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpService} from "../../../shared/service/http.service";
import {take} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {SnackbarComponent, SnackbarData} from "../../shared/snackbar/snackbar.component";
import {SnackbarService} from "../../../shared/service/snackbar.service";
import {LocalStorageService} from "../../../shared/service/local-storage.service";
import {ModalOutcome} from "../../../shared/constants/modalOutcome";
import {AuthData} from "../../authorization-screen/authorization-screen.component";

@Component({
  selector: 'app-change-email-modal',
  standalone: true,
  imports: [
    MatDialogClose,
    NgOptimizedImage,
    ReactiveFormsModule
  ],
  templateUrl: './change-email-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './change-email-modal.component.scss'
})
export class ChangeEmailModalComponent {
  loading: boolean = false;
  newEmailFormGroup = new FormGroup({
    newEmail: new FormControl('', {nonNullable: true, validators: [Validators.email]}),
    password: new FormControl('', {nonNullable: true, validators: [Validators.required]})
  })

  readonly dialogData = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<ChangeEmailModalComponent>);
  readonly ModalOutcome = ModalOutcome

  constructor(
    private readonly httpService: HttpService,
    private readonly snackbarService: SnackbarService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly localStorage: LocalStorageService
  ) {
  }

  getFormGroup() {
    return this.newEmailFormGroup.controls;
  }

  changeEmail() {
    this.loading = true;
    if (this.newEmailDuplicate()) return;
    if (this.newEmailFormGroup.valid) {
      this.httpService.post('auth/change-email', this.newEmailFormGroup.value).pipe(
        take(1)
      ).subscribe({
        next: (newToken: AuthData) => {
          this.handleDataChange(newToken)
        },
        error: (e: HttpErrorResponse) => {
          this.handleError(e);
        }
      })
    }
  }

  private newEmailDuplicate() {
    const duplicated = this.getFormGroup().newEmail.value === this.dialogData.oldEmail

    if (duplicated) {
      let snackbarData: SnackbarData = {
        message: 'Adresy email nie mogą być takie same',
        variant: "error",
        closeButton: true
      }
      this.snackbarService.snackbarFromComponent(SnackbarComponent, snackbarData)
      this.loading = false;
    }

    return duplicated
  }

  private handleDataChange(newToken: AuthData) {
    this.localStorage.setItem('uniteam-token', newToken.access_token)
    this.loading = false;
    this.changeDetectorRef.detectChanges();
    this.dialogRef.close(ModalOutcome.SUCCESS)
  }

  private handleError(e: HttpErrorResponse) {
    let data: SnackbarData = {
      message: 'Ups! Coś poszło nie tak :(',
      variant: "error",
      closeButton: true
    }

    if (e.status === 401) {
      data = {
        message: 'Niepoprawne dane',
        variant: "error",
        closeButton: true
      }
    }

    this.snackbarService.snackbarFromComponent(SnackbarComponent, data)
    this.loading = false;
    this.changeDetectorRef.detectChanges()
  }
}
