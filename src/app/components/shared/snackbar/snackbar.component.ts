import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {MAT_SNACK_BAR_DATA} from "@angular/material/snack-bar";
import {NgOptimizedImage} from "@angular/common";
import {SnackbarService} from "../../../shared/service/snackbar.service";

export type SnackbarData = {
  message: string
  variant: 'warning' | 'info' | 'error'
  closeButton?: boolean
}

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class SnackbarComponent {

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: SnackbarData,
    private readonly snackbarService: SnackbarService
  ) {
  }

  dismissSnackbar(){
    this.snackbarService.dismissSnackbar()
  }

}
