import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject} from '@angular/core';
import {MatDialog, MatDialogClose} from "@angular/material/dialog";
import {NgOptimizedImage} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpService} from "../../../shared/service/http.service";
import {take} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {TokenData} from "../../authorization-screen/authorization-screen.component";
import {SnackbarComponent, SnackbarData} from "../../shared/snackbar/snackbar.component";
import {SnackbarService} from "../../../shared/service/snackbar.service";
import {LocalStorageService} from "../../../shared/service/local-storage.service";

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
  dialog = inject(MatDialog)
  loading: boolean = false;

  newEmailFormGroup = new FormGroup({
    newEmail: new FormControl('', {nonNullable: true, validators: [Validators.email]}),
    password: new FormControl('', {nonNullable: true, validators: [Validators.required]})
  })

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
    console.log(this.newEmailFormGroup)
    if (this.newEmailFormGroup.valid) {
      this.httpService.post('auth/change-email', this.newEmailFormGroup.value).pipe(
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


  private handleDataChange(newToken: TokenData) {
    this.localStorage.setItem('uniteam-token', newToken.access_token)
    this.loading = false;
    this.changeDetectorRef.detectChanges();
    this.dialog.closeAll()
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
