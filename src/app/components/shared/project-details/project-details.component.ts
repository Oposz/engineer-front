import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {JsonPipe, NgOptimizedImage} from "@angular/common";
import {BreadcrumbsComponent} from "../breadcrumbs/breadcrumbs.component";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {NgScrollbar} from "ngx-scrollbar";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatInput, MatSuffix} from "@angular/material/input";
import {LoaderComponent} from "../loader/loader.component";
import {HttpService} from "../../../shared/service/http.service";
import {take} from "rxjs";
import {DefinedPositionWithAvailability, Project} from "../../../shared/constants/project";
import {SponsorDetailsComponent} from "./sponsor-details/sponsor-details.component";
import {getDate} from "../../../utils/date";
import {MatDialog} from "@angular/material/dialog";
import {ApplyToProjectModalComponent} from "./apply-to-project-modal/apply-to-project-modal.component";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ModalOutcome} from "../../../shared/constants/modalOutcome";
import {PhotoComponent} from "../photo/photo.component";

type ModalOutcomeWithData = {
  result: ModalOutcome,
  data: Project
}

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [
    NgOptimizedImage,
    BreadcrumbsComponent,
    RouterLink,
    NgScrollbar,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatInput,
    MatSuffix,
    LoaderComponent,
    JsonPipe,
    SponsorDetailsComponent,
    PhotoComponent
  ],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectDetailsComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  readonly destroyRef = inject(DestroyRef)

  variant: 'team' | 'project' = 'project'
  fetching = true;
  project!: Project
  definedPositions!: DefinedPositionWithAvailability[]
  private projectId: string = ''

  constructor(private readonly httpService: HttpService,
              private readonly route: ActivatedRoute,
              private readonly router: Router,
              private readonly changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.getProjectId();
    this.fetchProject();
    this.getTemplateVariant();
  }

  openApplyModal() {
    const dialog = this.dialog.open(ApplyToProjectModalComponent, {width: '500px', data: this.definedPositions})
    dialog.afterClosed().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((outcome: ModalOutcomeWithData) => {
      if (outcome.result !== ModalOutcome.SUCCESS) {
        return;
      }
      this.prepareProjectToDisplay(outcome.data)
      this.variant = 'team';
      this.changeDetectorRef.detectChanges();
    })

  }

  private fetchProject() {
    this.httpService.get(`projects/${this.projectId}`).subscribe((project: Project) => {
      this.prepareProjectToDisplay(project)
      this.fetching = false;
      this.changeDetectorRef.detectChanges();
    })
  }

  private prepareProjectToDisplay(project: Project) {
    this.project = project;
    this.definedPositions = project.definedPositions.map(position => ({
      ...position,
      closedSlots: project.takenPositions.filter(taken =>
        taken.definedPositionId === position.id
      ).length
    }));
  }

  private getTemplateVariant() {
    if (this.router.url.includes('teams')) {
      this.variant = 'team'
    }
  }

  private getProjectId() {
    this.route.params.pipe(
      take(1)
    ).subscribe((params) => {
      this.projectId = params['id'];
    })
  }

  protected readonly getDate = getDate;
}
