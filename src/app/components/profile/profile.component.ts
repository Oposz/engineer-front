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
  readonly dialog = inject(MatDialog);

  user$: Observable<User> = this.httpService.get('users/me').pipe(
    take(1)
  )

  constructor(
    private readonly httpService: HttpService
  ) {
  }


  openChangePasswordModal() {
    console.log('dupa')
  }

  openEmailChangeDialog() {
    this.dialog.open(ChangeEmailModalComponent, {width: '500px'}).afterClosed().subscribe((data) => {
      if (data !== 'abandon') {
        this.refreshUserData()
      }
    })
  }

  private refreshUserData() {
    this.user$ = this.httpService.get('users/me').pipe(
      take(1)
    )
  }


}
