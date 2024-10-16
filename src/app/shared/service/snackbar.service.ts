import {inject, Injectable} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {ComponentType} from "@angular/cdk/portal";
import {SnackbarData} from "../../components/shared/snackbar/snackbar.component";

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  private readonly snackbarService = inject(MatSnackBar)

  constructor() {
  }

  snackbarFromComponent(componentName: ComponentType<any>, data: SnackbarData) {
    this.snackbarService.openFromComponent(componentName, {
      data: data,
      duration: 5000,
      horizontalPosition: "right"
    })
  }

  dismissSnackbar(){
    this.snackbarService.dismiss()
  }
}
