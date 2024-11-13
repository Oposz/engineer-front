import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ViewHeaderComponent} from "../shared/view-header/view-header.component";
import {QuickFiltersComponent, SortingMode} from "../shared/quick-filters/quick-filters.component";
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
  allProjects: Project[] = []
  renderedProjects: Project[] = [];

  constructor(
    private readonly httpService: HttpService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.fetchAllProjects();
  }

  filterFavourites(favouritesVisible: boolean) {
    if (favouritesVisible) {
      this.renderedProjects = this.allProjects.filter((project) => project.favourite)
    } else {
      this.renderedProjects = this.allProjects;
    }
    this.changeDetectorRef.detectChanges();
  }

  sortProjects(sortingMode: SortingMode) {
    if (sortingMode===SortingMode.ASCENDING){
      this.renderedProjects.sort((a, b) => a.name.localeCompare(b.name))
    } else {
      this.renderedProjects.sort((a, b) => b.name.localeCompare(a.name))
    }
    this.changeDetectorRef.detectChanges();
  }

  private fetchAllProjects() {
    this.httpService.get('projects/all').subscribe((projects: Project[]) => {
      this.allProjects = projects.sort((a, b) => a.name.localeCompare(b.name));
      this.renderedProjects = this.allProjects;
      this.fetching = false;
      this.changeDetectorRef.detectChanges();
    })
  }
}
