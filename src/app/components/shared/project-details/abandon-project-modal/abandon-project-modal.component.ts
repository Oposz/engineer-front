import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogClose, MatDialogRef} from "@angular/material/dialog";
import {NgOptimizedImage} from "@angular/common";
import {ModalOutcome} from "../../../../shared/constants/modalOutcome";
import {HttpService} from "../../../../shared/service/http.service";
import {Project} from "../../../../shared/constants/project";
import {HttpErrorResponse} from "@angular/common/http";
import {SnackbarComponent, SnackbarData} from "../../snackbar/snackbar.component";
import {SnackbarService} from "../../../../shared/service/snackbar.service";

@Component({
  selector: 'app-abandon-project-modal',
  standalone: true,
  imports: [
    MatDialogClose,
    NgOptimizedImage
  ],
  templateUrl: './abandon-project-modal.component.html',
  styleUrl: './abandon-project-modal.component.scss'
})
export class AbandonProjectModalComponent {
  loading = false;

  readonly dialogRef = inject(MatDialogRef<AbandonProjectModalComponent>);
  readonly projectId: string = inject(MAT_DIALOG_DATA);
  protected readonly ModalOutcome = ModalOutcome;

  constructor(private readonly httpService: HttpService,
              private readonly snackbarService:SnackbarService) {
  }

  abandonProject() {
    this.loading = true;
    this.httpService.patch('projects/abandon', {projectId: this.projectId}).subscribe({
      next: (project: Project) => {
        this.handleSuccess(project)
      },
      error: (e: HttpErrorResponse) => {
        this.handleError(e);
      }
    })
  }

  private handleSuccess(project: Project) {
    this.loading = false;
    this.dialogRef.close({result: ModalOutcome.SUCCESS, data: project})
  }

  private handleError(e: HttpErrorResponse) {
    let snackbarData: SnackbarData = {
      message: 'Ups! Coś poszło nie tak :(, odśwież stronę i spróbuj ponownie',
      variant: "error",
      closeButton: true
    }

    this.snackbarService.snackbarFromComponent(SnackbarComponent, snackbarData)
    this.loading = false;
  }
}
