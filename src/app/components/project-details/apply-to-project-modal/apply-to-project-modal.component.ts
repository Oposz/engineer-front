import {Component, inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogClose, MatDialogRef} from "@angular/material/dialog";
import {NgOptimizedImage} from "@angular/common";
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {NgScrollbar} from "ngx-scrollbar";
import {HttpErrorResponse} from "@angular/common/http";
import {DefinedPositionWithAvailability, Project} from "../../../shared/constants/project";
import {HttpService} from "../../../shared/service/http.service";
import {SnackbarService} from "../../../shared/service/snackbar.service";
import {ModalOutcome} from '../../../shared/constants/modalOutcome';
import {SnackbarComponent, SnackbarData} from "../../shared/snackbar/snackbar.component";

@Component({
  selector: 'app-apply-to-project-modal',
  standalone: true,
  imports: [
    MatDialogClose,
    NgOptimizedImage,
    ReactiveFormsModule,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatOption,
    NgScrollbar,
    FormsModule
  ],
  templateUrl: './apply-to-project-modal.component.html',
  styleUrl: './apply-to-project-modal.component.scss'
})
export class ApplyToProjectModalComponent implements OnInit {

  position = new FormControl<DefinedPositionWithAvailability | null>(null, Validators.required)
  availablePositions: DefinedPositionWithAvailability[] = []
  loading = false;

  readonly dialogRef = inject(MatDialogRef<ApplyToProjectModalComponent>);
  readonly dialogData: DefinedPositionWithAvailability[] = inject(MAT_DIALOG_DATA);
  protected readonly ModalOutcome = ModalOutcome;

  constructor(private readonly httpService: HttpService,
              private readonly snackbarService: SnackbarService,) {
  }

  ngOnInit() {
    this.availablePositions = this.dialogData.filter((position) => position.closedSlots !== position.quantity)
  }

  applyToProject() {
    this.loading=true
    if (this.position.value) {
      const requestData = {
        id: this.position.value.id,
        projectId: this.position.value.projectId,
      }

      this.httpService.patch('projects/apply', requestData).subscribe({
        next: (project: Project) => {
          this.handleSuccess(project)
        },
        error: (e: HttpErrorResponse) => {
          this.handleError(e);
        }
      })
    }
  }

  private handleSuccess(project: Project){
    this.loading=false;
    this.dialogRef.close({result:ModalOutcome.SUCCESS, data:project})
  }

  private handleError(e: HttpErrorResponse) {
    let data: SnackbarData = {
      message: 'Ups! Coś poszło nie tak :(',
      variant: "error",
      closeButton: true
    }

    this.snackbarService.snackbarFromComponent(SnackbarComponent, data)
    this.loading = false;
  }

  positionDisplayFn(value: DefinedPositionWithAvailability) {
    return value ? `${value.name}` : '';
  }
}
