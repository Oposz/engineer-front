import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {AsyncPipe, NgOptimizedImage} from "@angular/common";
import {NewPositionComponent} from "./new-position/new-position.component";
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerInputEvent,
  MatDatepickerToggle
} from "@angular/material/datepicker";
import {MatInput, MatSuffix} from "@angular/material/input";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {debounceTime, forkJoin, of, switchMap, take} from "rxjs";
import {HttpService} from "../../shared/service/http.service";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {NgScrollbar} from "ngx-scrollbar";
import {University} from "../../shared/constants/university";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Leader} from "../../shared/constants/leader";
import {DateMaskDirective} from "../shared/quick-filters/date-mask.directive";
import {MatDialog} from "@angular/material/dialog";
import {AddSponsorModalComponent} from "./add-sponsor-modal/add-sponsor-modal.component";
import {ModalOutcome} from "../../shared/constants/modalOutcome";
import {MatTooltip} from "@angular/material/tooltip";
import {DefinedPosition, PositionsService} from "./positions.service";
import {UploadService} from "../../shared/service/upload.service";
import {CreatedProject} from "../../shared/constants/project";
import {HttpErrorResponse} from "@angular/common/http";
import {SnackbarComponent, SnackbarData} from "../shared/snackbar/snackbar.component";
import {SnackbarService} from "../../shared/service/snackbar.service";
import {Router} from "@angular/router";

interface newProjectGroup {
  projectName: FormControl<string>,
  description: FormControl<string>,
  university: FormControl<string>,
  leader: FormControl<Leader | null>,
  dueTo: FormControl<string>
}

type SponsorData = {
  name: string,
  description: string | null,
  photo: File
}

@Component({
  selector: 'app-add-new-project',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NewPositionComponent,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatInput,
    MatSuffix,
    FormsModule,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatOption,
    NgScrollbar,
    ReactiveFormsModule,
    AsyncPipe,
    DateMaskDirective,
    MatTooltip
  ],
  templateUrl: './add-new-project.component.html',
  styleUrl: './add-new-project.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddNewProjectComponent implements OnInit, OnDestroy {
  @ViewChild('tooltip')
  tooltip!: MatTooltip;

  @ViewChild('imageInput', {static: true})
  fileInput!: ElementRef;

  readonly destroyRef = inject(DestroyRef);
  readonly dialog = inject(MatDialog);
  readonly uploadService = inject(UploadService);

  uploadedPhoto!: { file: File, src: string }

  userUniversities: University[] = []
  filteredUniversities: University[] = [];

  universityLeaders: Leader[] = [];

  loading = false;

  newProjectFormGroup: FormGroup<newProjectGroup> = new FormGroup({
    projectName: new FormControl<string>('', {nonNullable: true, validators: [Validators.minLength(3)]}),
    description: new FormControl<string>('', {nonNullable: true}),
    university: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
    leader: new FormControl<Leader | null>(null, Validators.required),
    dueTo: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
  })

  newPositionControl = new FormControl('')

  sponsors: SponsorData[] = [];
  positions: DefinedPosition[] = [];

  minDate: Date = new Date();

  validate = false;

  constructor(
    private readonly httpService: HttpService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly positionsService: PositionsService,
    private readonly snackbarService: SnackbarService,
    private readonly router: Router
  ) {
  }

  ngOnInit() {
    this.getFormGroupControls().leader.disable();
    this.fetchUserUniversities();
    this.observeUniversityInputChanged();
    this.positions = this.positionsService.getProjectPositions()
    this.observeNewPositions();
  }

  leaderDisplayFn(value: Leader) {
    return value ? `${value.name} ${value.lastName}` : '';
  }

  uploadImage(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    const file = files[0];
    this.uploadedPhoto = {file, src: URL.createObjectURL(file)};
  }

  onImageClick() {
    this.fileInput.nativeElement.click()
  }

  onDateChange(event: MatDatepickerInputEvent<any>) {
    this.getFormGroupControls().dueTo.setValue(event.value);
  }

  saveNewProject() {
    this.loading = true;

    if (!this.newProjectFormGroup.valid) {
      this.validate = true;
      this.tooltip.toggle()
      return;
    }
    const sponsorPhotos = this.sponsors.map((sponsor) => {
      return this.uploadService.uploadFile$(sponsor.photo)
    })

    const uploadFiles = [
      ...sponsorPhotos,
      this.uploadedPhoto ? this.uploadService.uploadFile$(this.uploadedPhoto.file) : of(null)
    ]

    const requestData = {
      ...this.newProjectFormGroup.value,
      leader: this.newProjectFormGroup.value.leader?.id,
      university: this.userUniversities.find((_university) => _university.name === this.newProjectFormGroup.value.university)?.id,
      positions: this.positionsService.getProjectPositions(),
      sponsors: this.sponsors,
      photo: null
    }

    forkJoin(uploadFiles).pipe(
      switchMap((uploadIds: { id: string }[]) => {
        const [sponsorUploadIds, projectPhotoId] = [
          uploadIds.slice(0, -1),
          uploadIds[uploadIds.length - 1]
        ];
        const sponsorsWithPhotos = requestData.sponsors.map((sponsor, index) => ({
          ...sponsor,
          photo: sponsorUploadIds[index].id
        }));
        const updatedRequestData = {
          ...requestData,
          sponsors: sponsorsWithPhotos,
          photo: projectPhotoId.id
        };
        return this.httpService.post('projects/add', updatedRequestData)
      })
    ).subscribe({
      next: (project: CreatedProject) => {
        this.handleSuccess(project)
      },
      error: (e: HttpErrorResponse) => {
        this.handleError(e);
      }
    })
  }

  getFormGroupControls() {
    return this.newProjectFormGroup.controls;
  }

  getPhotoUrl(file: File) {
    return URL.createObjectURL(file)
  }

  openAddSponsorModal() {
    const modal = this.dialog.open(AddSponsorModalComponent, {width: '500px'})
    modal.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((modalData: { result: ModalOutcome, data: SponsorData }) => {
        this.sponsors.push(modalData.data)
        this.changeDetectorRef.detectChanges();
      })
  }

  addPositionToProject() {
    if (this.newPositionControl.value) {
      this.positionsService.addNewPosition(this.newPositionControl.value)
    }
    this.newPositionControl.reset();
  }

  observeNewPositions() {
    this.positionsService.renewData$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.positions = this.positionsService.getProjectPositions();
      this.changeDetectorRef.detectChanges();
    })
  }

  private handleSuccess(project: CreatedProject) {
    this.loading = false;
    let data: SnackbarData = {
      message: 'Utworzono projekt!',
      variant: "info",
      closeButton: true
    }
    this.snackbarService.snackbarFromComponent(SnackbarComponent, data)
    this.changeDetectorRef.detectChanges()
    this.router.navigate(['/projects', project.id]);
  }

  private handleError(e: HttpErrorResponse) {
    let data: SnackbarData = {
      message: 'Ups! Coś poszło nie tak :(',
      variant: "error",
      closeButton: true
    }
    this.snackbarService.snackbarFromComponent(SnackbarComponent, data)
    this.loading = false;
    this.changeDetectorRef.detectChanges()
  }

  private fetchUserUniversities() {
    this.httpService.get('user/universities').pipe(
      take(1),
    ).subscribe((data: University[]) => {
      this.userUniversities = data;
      this.filteredUniversities = this.userUniversities;
    })
  }

  private observeUniversityInputChanged() {
    this.getFormGroupControls().university.valueChanges.pipe(
      debounceTime(200),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((value: string) => {
      this.filteredUniversities = this.userUniversities.filter(
        university => university.name.toLowerCase().includes(value.toLowerCase())
      )
      this.isCorrectUniversityPicked(value)
    })
  }

  private isCorrectUniversityPicked(value: string) {
    const university = this.userUniversities.find((_university) => _university.name === value)
    if (!university) {
      this.getFormGroupControls().leader.reset();
      this.getFormGroupControls().leader.disable();
      return;
    }
    this.getFormGroupControls().leader.enable();
    this.universityLeaders = university.leaders;
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy() {
    this.positionsService.resetService();
  }

}
