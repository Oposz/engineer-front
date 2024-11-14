import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
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
    JsonPipe
  ],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectDetailsComponent implements OnInit {


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

  private fetchProject() {
    this.httpService.get(`projects/${this.projectId}`).subscribe((project: Project) => {
      this.project = project;
      this.definedPositions = project.definedPositions.map(position => ({
        ...position,
        taken: project.takenPositions.some(taken => taken.definedPositionId === position.id)
      }));
      this.fetching = false;
      this.changeDetectorRef.detectChanges()
    })
  }

  private getTemplateVariant(){
    if (this.router.url.includes('teams')){
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

}
