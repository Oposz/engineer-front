import {Component, inject} from '@angular/core';
import {ViewHeaderComponent} from "../shared/view-header/view-header.component";
import {HttpService} from "../../shared/service/http.service";
import {Observable, take} from "rxjs";
import {User} from "../../shared/constants/user";
import {AsyncPipe, NgOptimizedImage} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {UniversityCardComponent} from "../universities/university-card/university-card.component";
import {NgScrollbar} from "ngx-scrollbar";
import {MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {ChangeEmailModalComponent} from "./change-email-modal/change-email-modal.component";
import {ChangePasswordModalComponent} from "./change-password-modal/change-password-modal.component";
import {ModalOutcome} from "../../shared/constants/modalOutcome";
import {ConnectNewUniversityComponent} from "./connect-new-university/connect-new-university.component";
import {University} from "../../shared/constants/university";


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ViewHeaderComponent,
    AsyncPipe,
    ReactiveFormsModule,
    NgOptimizedImage,
    UniversityCardComponent,
    NgScrollbar,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  userPersonalData$: Observable<User> = this.httpService.get('user').pipe(
    take(1)
  )

  readonly dialog = inject(MatDialog);

  constructor(
    private readonly httpService: HttpService
  ) {
  }

  openPasswordChangeModal() {
    this.dialog.open(ChangePasswordModalComponent, {width: '500px'})
  }

  openEmailChangeDialog(oldEmail: string) {
    const openedDialog = this.dialog.open(ChangeEmailModalComponent, {width: '500px', data: {oldEmail}})

    openedDialog.afterClosed()
      .subscribe((action: ModalOutcome) => {
        if (action === ModalOutcome.SUCCESS) {
          this.refreshUserData()
        }
      })
  }

  connectUniversity(universities: University[]) {
    this.dialog.open(ConnectNewUniversityComponent, {width: '500px', data:{universities}}).afterClosed()
      .subscribe((action: ModalOutcome) => {
        if (action === ModalOutcome.SUCCESS) {
          this.refreshUserData()
        }
      })
  }

  private refreshUserData() {
    this.userPersonalData$ = this.httpService.get('user').pipe(
      take(1)
    )
  }

}
