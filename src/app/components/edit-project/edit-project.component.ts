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
import {DateMaskDirective} from "../shared/quick-filters/date-mask.directive";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerInputEvent,
  MatDatepickerToggle
} from "@angular/material/datepicker";
import {MatInput, MatSuffix} from "@angular/material/input";
import {NewPositionComponent} from "../add-new-project/new-position/new-position.component";
import {NgOptimizedImage} from "@angular/common";
import {NgScrollbar} from "ngx-scrollbar";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {PhotoComponent} from "../shared/photo/photo.component";
import {MatTooltip} from "@angular/material/tooltip";
import {MatDialog} from "@angular/material/dialog";
import {UploadService} from "../../shared/service/upload.service";
import {University, UniversityWithLeaders} from "../../shared/constants/university";
import {Leader} from "../../shared/constants/leader";
import {newProjectGroup, SponsorData} from "../add-new-project/add-new-project.component";
import {DefinedPosition, PositionsService} from "../add-new-project/positions.service";
import {HttpService} from "../../shared/service/http.service";
import {SnackbarService} from "../../shared/service/snackbar.service";
import {ActivatedRoute, Router} from "@angular/router";
import {debounceTime, forkJoin, map, of, switchMap, take} from "rxjs";
import {CreatedProject, Project} from "../../shared/constants/project";
import {HttpErrorResponse} from "@angular/common/http";
import {AddSponsorModalComponent} from "../add-new-project/add-sponsor-modal/add-sponsor-modal.component";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ModalOutcome} from "../../shared/constants/modalOutcome";
import {SnackbarComponent, SnackbarData} from "../shared/snackbar/snackbar.component";

@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [
    DateMaskDirective,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatInput,
    MatOption,
    MatSuffix,
    NewPositionComponent,
    NgOptimizedImage,
    NgScrollbar,
    ReactiveFormsModule,
    PhotoComponent,
    MatTooltip
  ],
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditProjectComponent implements OnInit, OnDestroy {
  @ViewChild('tooltip')
  tooltip!: MatTooltip;

  @ViewChild('imageInput', {static: true})
  fileInput!: ElementRef;

  readonly destroyRef = inject(DestroyRef);
  readonly dialog = inject(MatDialog);
  readonly uploadService = inject(UploadService);

  uploadedPhoto!: { file: File, src: string }

  userUniversities: UniversityWithLeaders[] = []
  filteredUniversities: UniversityWithLeaders[] = [];

  universityLeaders: Leader[] = [];

  project!: Project;

  loading = false;

  editProjectFormGroup: FormGroup<newProjectGroup> = new FormGroup({
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
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.fetchProject();
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

  removeSponsor(sponsor: SponsorData) {
    const sponsorIndex = this.sponsors.indexOf(sponsor)
    if (sponsorIndex === -1) return;
    this.sponsors.splice(sponsorIndex, 1);
    this.changeDetectorRef.detectChanges();
  }

  fetchProject() {
    this.projectId$().pipe(
      switchMap((projectId) => forkJoin({
        project: this.httpService.get(`projects/${projectId}`),
        universities: this.httpService.get('user/universities')
      }))
    ).subscribe(({project, universities}: { project: Project, universities: UniversityWithLeaders[] }) => {
      this.project = structuredClone(project);
      this.userUniversities = universities;
      this.filteredUniversities = this.userUniversities;
      this.setFormFields(project, universities);
      this.positionsService.setAlreadyDefinedPositions(project.definedPositions);
      this.sponsors = structuredClone(project.sponsors);
      this.changeDetectorRef.detectChanges();
    })
  }

  editProject() {
    this.loading = true;

    if (!this.editProjectFormGroup.valid) {
      this.validate = true;
      this.tooltip.toggle()
      return;
    }
    const sponsorPhotos = this.sponsors.map((sponsor) => {
      if (!sponsor.photo) {
        return of(null);
      }
      return this.uploadService.uploadFile$(sponsor.photo!);
    })

    const uploadFiles = [
      ...sponsorPhotos,
      this.uploadedPhoto ? this.uploadService.uploadFile$(this.uploadedPhoto.file) : of(null)
    ]

    const positions = this.positionsService.getProjectPositions()
    const positionsToDelete = this.project.definedPositions.filter(definedPosition =>
      !positions.some(position => position.id === definedPosition.id)
    );
    const sponsorsToDelete = this.project.sponsors.filter(sponsor => !this.sponsors.some(_sponsor => _sponsor.id === sponsor.id));

    const requestData = {
      ...this.editProjectFormGroup.value,
      leader: this.editProjectFormGroup.value.leader?.id,
      university: this.userUniversities.find((_university) => _university.name === this.editProjectFormGroup.value.university)?.id,
      positions: positions,
      positionsToDelete: positionsToDelete,
      sponsors: this.sponsors,
      deletedSponsors: sponsorsToDelete,
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
          photo: sponsorUploadIds[index] ? sponsorUploadIds[index].id : ''
        }));
        const updatedRequestData = {
          ...requestData,
          sponsors: sponsorsWithPhotos,
          photo: projectPhotoId ? projectPhotoId.id : ''
        };
        return this.httpService.patch(`projects/edit/${this.project.id}`, updatedRequestData)
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
    return this.editProjectFormGroup.controls;
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

  private setFormFields(project: Project, universities: University[]) {
    this.getFormGroupControls().projectName.setValue(project.name);
    this.getFormGroupControls().description.setValue(project.description);
    const university = universities.find((university) => university.id === project.leadingUniversityId)?.name
    if (university){
      this.getFormGroupControls().university.setValue(university);
    }
    this.getFormGroupControls().leader.setValue(project.leader);
    if (project.dueTo) {
      const date = new Date(project.dueTo);
      this.getFormGroupControls().dueTo.setValue(date.toISOString());
    }
  }

  private handleSuccess(project: CreatedProject) {
    this.loading = false;
    let data: SnackbarData = {
      message: 'Edytowano projekt!',
      variant: "info",
      closeButton: true
    }
    this.snackbarService.snackbarFromComponent(SnackbarComponent, data)
    this.changeDetectorRef.detectChanges()
    this.router.navigate(['/panel']);
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

  private projectId$() {
    return this.route.params.pipe(
      map((params) => params['id']),
      take(1)
    )
  }

  ngOnDestroy() {
    this.positionsService.resetService();
  }
}
