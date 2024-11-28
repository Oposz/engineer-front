import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {PanelActionsComponent} from "../../shared/panel-actions/panel-actions.component";
import {ViewHeaderComponent} from "../../../shared/view-header/view-header.component";
import {HttpService} from "../../../../shared/service/http.service";
import {ProjectWithUni} from "../../../../shared/constants/project";
import {PhotoComponent} from "../../../shared/photo/photo.component";
import {getDate} from "../../../../utils/date";
import {CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport} from "@angular/cdk/scrolling";
import {NgOptimizedImage} from "@angular/common";
import {MatMenu, MatMenuContent, MatMenuTrigger} from "@angular/material/menu";
import {HttpErrorResponse} from "@angular/common/http";
import {SnackbarComponent, SnackbarData} from "../../../shared/snackbar/snackbar.component";
import {SnackbarService} from "../../../../shared/service/snackbar.service";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-projects-panel',
  standalone: true,
  imports: [
    PanelActionsComponent,
    ViewHeaderComponent,
    PhotoComponent,
    CdkVirtualScrollViewport,
    CdkFixedSizeVirtualScroll,
    CdkVirtualForOf,
    NgOptimizedImage,
    MatMenu,
    MatMenuTrigger,
    MatMenuContent,
    RouterLink
  ],
  templateUrl: './projects-panel.component.html',
  styleUrl: './projects-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsPanelComponent implements OnInit {

  projects: ProjectWithUni[] = []
  projectsToModify: string[] = []

  protected readonly getDate = getDate;

  constructor(private readonly httpService: HttpService,
              private readonly changeDetectorRef: ChangeDetectorRef,
              private readonly snackbarService: SnackbarService) {
  }

  ngOnInit() {
    this.httpService.get('projects/all').subscribe((projects: ProjectWithUni[]) => {
      this.projects = projects;
      this.changeDetectorRef.detectChanges();
    })
  }

  adjustAllProjectsInList(checkboxEvent: Event) {
    const checkboxValue = checkboxEvent.target as HTMLInputElement
    if (checkboxValue.checked) {
      this.projectsToModify = this.projects.map((project) => project.id);
      return
    }
    this.projectsToModify = [];
    this.changeDetectorRef.detectChanges();
  }

  adjustProjectToModify(projectId: string, checkboxEvent: Event) {
    const checkboxValue = checkboxEvent.target as HTMLInputElement
    if (checkboxValue.checked) {
      this.projectsToModify.push(projectId);
      return
    }
    const projectIdIndex = this.projectsToModify.indexOf(projectId)
    if (projectIdIndex === -1) return
    this.projectsToModify.splice(projectIdIndex, 1)
    this.changeDetectorRef.detectChanges();
  }

  isProjectAlreadySelected(projectId: string) {
    return this.projectsToModify.some((_project) => _project === projectId);
  }

  deleteProject(projectId: string) {
    this.httpService.delete(`projects/delete/${projectId}`).subscribe({
      next: () => {
        const deletedProject = this.projects.find((project) => project.id === projectId)
        if (!deletedProject) return;
        const deletedProjectId = this.projects.indexOf(deletedProject)
        this.projects.splice(deletedProjectId, 1);
        this.handleSuccess()
      },
      error: (e: HttpErrorResponse) => {
        this.handleError(e);
      }
    })
  }

  deleteAllMarkedProjects() {
    this.httpService.patch(`projects/delete-all`, {projectIds: this.projectsToModify}).subscribe({
      next: () => {
        this.projects = this.projects.filter(project =>
          !this.projectsToModify.includes(project.id)
        );
        this.handleSuccess()
      },
      error: (e: HttpErrorResponse) => {
        this.handleError(e);
      }
    })
  }

  private handleSuccess() {
    let data: SnackbarData = {
      message: 'Operacja przebiegła pomyślnie',
      variant: "info",
      closeButton: true
    }

    this.snackbarService.snackbarFromComponent(SnackbarComponent, data)
    this.changeDetectorRef.detectChanges()
  }

  private handleError(e: HttpErrorResponse) {
    let data: SnackbarData = {
      message: 'Ups! Coś poszło nie tak :(',
      variant: "error",
      closeButton: true
    }

    this.snackbarService.snackbarFromComponent(SnackbarComponent, data)
    this.changeDetectorRef.detectChanges()
  }

}
