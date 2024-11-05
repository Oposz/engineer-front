import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject} from '@angular/core';
import {MatDialogClose, MatDialogRef} from "@angular/material/dialog";
import {NgOptimizedImage} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ModalOutcome} from "../../../shared/constants/modalOutcome";
import {HttpService} from "../../../shared/service/http.service";
import {SnackbarService} from "../../../shared/service/snackbar.service";
import {LocalStorageService} from "../../../shared/service/local-storage.service";
import {TokenData} from "../../authorization-screen/authorization-screen.component";
import {HttpErrorResponse} from "@angular/common/http";
import {SnackbarComponent, SnackbarData} from "../../shared/snackbar/snackbar.component";
import {take} from "rxjs";

@Component({
  selector: 'app-change-password-modal',
  standalone: true,
  imports: [
    MatDialogClose,
    NgOptimizedImage,
    ReactiveFormsModule
  ],
  templateUrl: './change-password-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './change-password-modal.component.scss'
})
export class ChangePasswordModalComponent {

  loading: boolean = false;
  newPasswordFormGroup = new FormGroup({
    newPassword: new FormControl('', {nonNullable: true, validators: [Validators.minLength(4), Validators.required]}),
    newPasswordConfirmation: new FormControl('', {
      nonNullable: true,
      validators: [Validators.minLength(4), Validators.required]
    }),
    password: new FormControl('', {nonNullable: true, validators: [Validators.required]})
  })

  readonly dialogRef = inject(MatDialogRef<ChangePasswordModalComponent>);
  readonly ModalOutcome = ModalOutcome

  constructor(
    private readonly httpService: HttpService,
    private readonly snackbarService: SnackbarService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly localStorage: LocalStorageService
  ) {
  }

  getFormGroup() {
    return this.newPasswordFormGroup.controls;
  }

  changePassword() {
    this.loading = true;
    if (!this.isPasswordMatching()) return;
    if (this.newPasswordFormGroup.valid) {
      const {newPasswordConfirmation, ...formData} = this.newPasswordFormGroup.value
      this.httpService.post('auth/change-password', formData).pipe(
        take(1)
      ).subscribe({
        next: (newToken: TokenData) => {
          this.handleDataChange(newToken)
        },
        error: (e: HttpErrorResponse) => {
          this.handleError(e);
        }
      })
    }
  }

  private isPasswordMatching() {
    const passwordsMatched = this.getFormGroup().newPassword.value === this.getFormGroup().newPasswordConfirmation.value

    if (!passwordsMatched) {
      this.loading = false;
      this.getFormGroup().newPasswordConfirmation.setErrors({'not-matched': true})
    }

    return passwordsMatched;
  }

  private handleDataChange(newToken: TokenData) {
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
