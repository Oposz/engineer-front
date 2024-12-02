import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogClose, MatDialogRef} from "@angular/material/dialog";
import {NgOptimizedImage} from "@angular/common";
import {ModalOutcome} from "../../../../../shared/constants/modalOutcome";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatTooltip} from "@angular/material/tooltip";
import {HttpService} from "../../../../../shared/service/http.service";
import {UploadService} from "../../../../../shared/service/upload.service";
import {switchMap} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {SnackbarComponent, SnackbarData} from "../../../../shared/snackbar/snackbar.component";
import {DetailedUniversity, University} from "../../../../../shared/constants/university";
import {SnackbarService} from "../../../../../shared/service/snackbar.service";
import {PhotoComponent} from "../../../../shared/photo/photo.component";

@Component({
  selector: 'app-edit-add-university-modal',
  standalone: true,
  imports: [
    MatDialogClose,
    NgOptimizedImage,
    FormsModule,
    ReactiveFormsModule,
    MatTooltip,
    PhotoComponent
  ],
  templateUrl: './add-edit-university-modal.component.html',
  styleUrl: './add-edit-university-modal.component.scss'
})
export class AddEditUniversityModalComponent implements OnInit {
  @ViewChild('imageInput', {static: true})
  fileInput!: ElementRef;

  newUniFormGroup = new FormGroup({
    name: new FormControl<string>('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl<string>('', [Validators.minLength(3)])
  })

  uploadedPhoto: { file: File, src: string } | null = null
  validate = false;
  loading = false;
  templateVariant: 'add' | 'edit' = 'add'


  readonly dialogRef = inject(MatDialogRef<AddEditUniversityModalComponent>);
  readonly dialogData: { university: University } = inject(MAT_DIALOG_DATA);


  constructor(
    private readonly httpService: HttpService,
    private readonly uploadService: UploadService,
    private readonly snackbarService: SnackbarService
  ) {
  }

  protected readonly ModalOutcome = ModalOutcome;


  ngOnInit() {
    if (this.dialogData.university) {
      this.templateVariant = "edit"
      this.setControls();
    }
  }

  submitForm() {
    if (this.templateVariant === 'edit') {
      this.editUni()
      return;
    }
    this.saveUni();
  }

  uploadImage(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    const file = files[0];
    this.uploadedPhoto = {file, src: URL.createObjectURL(file)};
  }

  getFormGroupControls() {
    return this.newUniFormGroup.controls;
  }

  private editUni() {
    if (!this.formValid()) {
      return;
    }
    const request$ = this.uploadedPhoto
      ? this.uploadService.uploadFile$(this.uploadedPhoto.file).pipe(
        switchMap(uploadId => this.editUni$(uploadId))
      )
      : this.editUni$();

    request$.subscribe({
      next: (university: DetailedUniversity) => {
        this.handleSuccess(university)
      },
      error: (e: HttpErrorResponse) => {
        this.handleError(e);
      }
    });
  }

  private saveUni() {
    if (!this.formValid()) {
      return;
    }
    const request$ = this.uploadedPhoto
      ? this.uploadService.uploadFile$(this.uploadedPhoto.file).pipe(
        switchMap(uploadId => this.saveNewUni$(uploadId))
      )
      : this.saveNewUni$();

    request$.subscribe({
      next: (university: DetailedUniversity) => {
        this.handleSuccess(university)
      },
      error: (e: HttpErrorResponse) => {
        this.handleError(e);
      }
    });
  }

  private editUni$(photoId?: { id: string }) {
    let requestData: {} = {
      ...this.newUniFormGroup.value,
    }
    if (this.uploadedPhoto) {
      requestData = {
        ...this.newUniFormGroup.value,
        photoId: photoId!.id
      }
    }
    return this.httpService.patch(`universities/edit/${this.dialogData.university.id}`, requestData)
  }

  private saveNewUni$(photoId?: { id: string }) {
    let requestData: {} = {
      ...this.newUniFormGroup.value,
    }
    if (this.uploadedPhoto) {
      requestData = {
        ...this.newUniFormGroup.value,
        photoId: photoId!.id
      }
    }
    return this.httpService.post('universities/new', requestData)
  }

  private formValid() {
    this.loading = true;
    if (!this.newUniFormGroup.valid) {
      this.validate = true;
      this.loading = false;
      return false;
    }
    return true;
  }

  private handleSuccess(university: DetailedUniversity) {
    this.loading = false;
    this.dialogRef.close({result: ModalOutcome.SUCCESS, data: university})
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

  private setControls() {
    this.getFormGroupControls().name.setValue(this.dialogData.university.name)
    this.getFormGroupControls().description.setValue(this.dialogData.university.description)
  }
}
