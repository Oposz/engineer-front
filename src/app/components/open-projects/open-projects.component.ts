import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ViewHeaderComponent} from "../shared/view-header/view-header.component";
import {QuickFiltersComponent} from "../shared/quick-filters/quick-filters.component";
import {ProjectCardComponent} from "./project-card/project-card.component";
import {Project} from "../../shared/constants/project";
import {NgScrollbar} from "ngx-scrollbar";
import {RouterLink} from "@angular/router";
import {HttpService} from "../../shared/service/http.service";
import {LoaderComponent} from "../shared/loader/loader.component";

@Component({
  selector: 'app-open-projects',
  standalone: true,
  imports: [
    ViewHeaderComponent,
    QuickFiltersComponent,
    ProjectCardComponent,
    NgScrollbar,
    RouterLink,
    LoaderComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './open-projects.component.html',
  styleUrl: './open-projects.component.scss'
})
export class OpenProjectsComponent implements OnInit {

  fetching: boolean = true;
  projects: Project[] = [];

  constructor(
    private readonly httpService: HttpService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.httpService.get('projects/all').subscribe((projects) => {
      this.projects = projects;
      this.fetching = false;
      this.changeDetectorRef.detectChanges();
    })
  }


  // private handleError(e: HttpErrorResponse) {
  //   let data: SnackbarData = {
  //     message: 'Ups! Coś poszło nie tak :(',
  //     variant: "error",
  //     closeButton: true
  //   }
  //
  //   this.snackbarService.snackbarFromComponent(SnackbarComponent, data)
  // }

}
