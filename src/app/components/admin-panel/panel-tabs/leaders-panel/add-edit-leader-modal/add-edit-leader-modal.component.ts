import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  ViewChild
} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogClose, MatDialogRef} from "@angular/material/dialog";
import {NgOptimizedImage} from "@angular/common";
import {ModalOutcome} from "../../../../../shared/constants/modalOutcome";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatTooltip} from "@angular/material/tooltip";
import {HttpService} from "../../../../../shared/service/http.service";
import {UploadService} from "../../../../../shared/service/upload.service";
import {startWith, switchMap, take} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {SnackbarComponent, SnackbarData} from "../../../../shared/snackbar/snackbar.component";
import {SnackbarService} from "../../../../../shared/service/snackbar.service";
import {PhotoComponent} from "../../../../shared/photo/photo.component";
import {DetailedLeaderCard} from "../../../../../shared/constants/leaderCard";
import {University} from "../../../../../shared/constants/university";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {NgScrollbar} from "ngx-scrollbar";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {LoaderComponent} from "../../../../shared/loader/loader.component";

@Component({
  selector: 'app-edit-add-leader-modal',
  standalone: true,
  imports: [
    MatDialogClose,
    NgOptimizedImage,
    FormsModule,
    ReactiveFormsModule,
    MatTooltip,
    PhotoComponent,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatOption,
    NgScrollbar,
    LoaderComponent
  ],
  templateUrl: './add-edit-leader-modal.component.html',
  styleUrl: './add-edit-leader-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEditLeaderModalComponent implements OnInit {
  @ViewChild('imageInput', {static: true})
  fileInput!: ElementRef;

  newLeaderFormGroup = new FormGroup({
    name: new FormControl<string>('', [Validators.required, Validators.minLength(3)]),
    lastName: new FormControl<string>('', [Validators.required, Validators.minLength(3)]),
    title: new FormControl<string>('', [Validators.required, Validators.minLength(1)]),
    phone: new FormControl<string>('', [Validators.required, Validators.pattern('(?<!\\w)(\\(?(\\+|00)?48\\)?)?[ -]?\\d{3}[ -]?\\d{3}[ -]?\\d{3}(?!\\w)')]),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    department: new FormControl<string>('', [Validators.required, Validators.minLength(3)]),
    university: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]})
  })

  uploadedPhoto: { file: File, src: string } | null = null
  validate = false;
  loading = false;
  templateVariant: 'add' | 'edit' = 'add'
  universities: University[] = []
  filteredUniversities: University[] = []
  fetching = true;

  readonly destroyRef = inject(DestroyRef);
  readonly dialogRef = inject(MatDialogRef<AddEditLeaderModalComponent>);
  readonly dialogData: { leader: DetailedLeaderCard } = inject(MAT_DIALOG_DATA);


  constructor(
    private readonly httpService: HttpService,
    private readonly uploadService: UploadService,
    private readonly snackbarService: SnackbarService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
  }

  protected readonly ModalOutcome = ModalOutcome;


  ngOnInit() {
    this.getAllUniversities();
    if (this.dialogData) {
      this.templateVariant = "edit"
    }
    this.observeAutocompleteFilter()
  }

  submitForm() {
    if (this.templateVariant === 'edit') {
      this.editLeader()
      return;
    }
    this.saveLeader();
  }

  uploadImage(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    const file = files[0];
    this.uploadedPhoto = {file, src: URL.createObjectURL(file)};
  }

  getFormGroupControls() {
    return this.newLeaderFormGroup.controls;
  }

  private observeAutocompleteFilter() {
    this.getFormGroupControls().university.valueChanges.pipe(
      startWith(''),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((value: string) => {
      this.filteredUniversities = this.universities.filter(
        university => university.name.toLowerCase().includes(value.toLowerCase())
      )
    })
  }

  private editLeader() {
    if (!this.formValid()) {
      return;
    }
    const request$ = this.uploadedPhoto
      ? this.uploadService.uploadFile$(this.uploadedPhoto.file).pipe(
        switchMap(uploadId => this.editLeader$(uploadId))
      )
      : this.editLeader$();

    request$.subscribe({
      next: (leader: DetailedLeaderCard) => {
        this.handleSuccess(leader)
      },
      error: (e: HttpErrorResponse) => {
        this.handleError(e);
      }
    });
  }

  private saveLeader() {
    if (!this.formValid()) {
      return;
    }
    const request$ = this.uploadedPhoto
      ? this.uploadService.uploadFile$(this.uploadedPhoto.file).pipe(
        switchMap(uploadId => this.saveNewLeader$(uploadId))
      )
      : this.saveNewLeader$();

    request$.subscribe({
      next: (leader: DetailedLeaderCard) => {
        this.handleSuccess(leader)
      },
      error: (e: HttpErrorResponse) => {
        this.handleError(e);
      }
    });
  }

  private editLeader$(photoId?: { id: string }) {
    const university = this.universities.find(uni => uni.name === this.getFormGroupControls().university.value)?.id

    let requestData: {} = {
      ...this.newLeaderFormGroup.value,
      university: university
    }
    if (this.uploadedPhoto) {
      requestData = {
        ...this.newLeaderFormGroup.value,
        university: university,
        photoId: photoId!.id
      }
    }
    return this.httpService.patch(`leaders/edit/${this.dialogData.leader.id}`, requestData)
  }

  private saveNewLeader$(photoId?: { id: string }) {
    const university = this.universities.find(uni => uni.name === this.getFormGroupControls().university.value)?.id

    let requestData: {} = {
      ...this.newLeaderFormGroup.value,
      university: university
    }
    if (this.uploadedPhoto) {
      requestData = {
        ...this.newLeaderFormGroup.value,
        university: university,
        photoId: photoId!.id
      }
    }
    return this.httpService.post('leaders/new', requestData)
  }

  private formValid() {
    this.loading = true;
    if (!this.newLeaderFormGroup.valid) {
      this.validate = true;
      this.loading = false;
      return false;
    }
    return true;
  }

  private handleSuccess(leader: DetailedLeaderCard) {
    this.loading = false;
    this.dialogRef.close({result: ModalOutcome.SUCCESS, data: leader})
  }

  private handleError(e: HttpErrorResponse) {
    let snackbarData: SnackbarData = {
      message: 'Ups! Coś poszło nie tak :(, odśwież stronę i spróbuj ponownie',
      variant: "error",
      closeButton: true
    }

    this.snackbarService.snackbarFromComponent(SnackbarComponent, snackbarData)
    this.loading = false;
    this.changeDetectorRef.detectChanges();
  }

  private setControls() {
    this.getFormGroupControls().name.setValue(this.dialogData.leader.name)
    this.getFormGroupControls().lastName.setValue(this.dialogData.leader.lastName)
    this.getFormGroupControls().title.setValue(this.dialogData.leader.title)
    this.getFormGroupControls().phone.setValue(this.dialogData.leader.phoneNumber)
    this.getFormGroupControls().email.setValue(this.dialogData.leader.email)
    this.getFormGroupControls().department.setValue(this.dialogData.leader.department)
    console.log(this.universities, this.dialogData.leader.university)
    const uni = this.universities.find(uni => uni.id === this.dialogData.leader.university.id)
    if (uni) {
      this.getFormGroupControls().university.setValue(uni.name)
    }
  }

  private getAllUniversities() {
    this.httpService.get('universities').pipe(
      take(1)
    ).subscribe((universities: University[]) => {
      this.universities = universities;
      this.filteredUniversities = universities;
      this.fetching = false;
      if (this.templateVariant === 'edit') {
        this.setControls();
      }
      this.changeDetectorRef.detectChanges();
    })
  }
}
