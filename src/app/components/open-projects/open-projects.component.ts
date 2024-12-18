import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ViewHeaderComponent} from "../shared/view-header/view-header.component";
import {QuickFiltersComponent, SortingMode} from "../shared/quick-filters/quick-filters.component";
import {ProjectCardComponent} from "./project-card/project-card.component";
import {Project} from "../../shared/constants/project";
import {NgScrollbar} from "ngx-scrollbar";
import {HttpService} from "../../shared/service/http.service";
import {LoaderComponent} from "../shared/loader/loader.component";
import {UserFavouritesService} from "../../shared/service/user-favourites.service";

@Component({
  selector: 'app-open-projects',
  standalone: true,
  imports: [
    ViewHeaderComponent,
    QuickFiltersComponent,
    ProjectCardComponent,
    NgScrollbar,
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
  projectsBeforeDateFiltering: Project[] = [];

  constructor(
    private readonly httpService: HttpService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly userFavouritesService: UserFavouritesService
  ) {
  }

  ngOnInit() {
    this.fetchAllProjects();
  }

  filterFavourites(favouritesVisible: boolean) {
    const userFavs = this.userFavouritesService.getUserFavs();
    if (favouritesVisible && userFavs) {
      this.renderedProjects = this.allProjects.filter((project) =>
        userFavs.includes(project.id)
      );
    } else {
      this.renderedProjects = this.allProjects;
    }
    this.changeDetectorRef.detectChanges();
  }

  sortProjects(sortingMode: SortingMode) {
    if (sortingMode === SortingMode.ASCENDING) {
      this.renderedProjects.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      this.renderedProjects.sort((a, b) => b.name.localeCompare(a.name));
    }
    this.changeDetectorRef.detectChanges();
  }

  filterProjectsByName(searchValue: string) {
    this.renderedProjects = this.allProjects.filter((project) => project.name.toLowerCase().includes(searchValue.toLowerCase()));
    this.projectsBeforeDateFiltering = this.renderedProjects;
    this.changeDetectorRef.detectChanges();
  }

  filterEndDueTo(date: string) {
    if (!date) {
      this.renderedProjects = this.projectsBeforeDateFiltering;
      return;
    }
    this.renderedProjects = this.projectsBeforeDateFiltering.filter((project) => {
      const projectDueTo = project.dueTo?.toString();
      return projectDueTo && projectDueTo < date;
    })
  }

  filterStartDueTo(date: string) {
    if (date === '') {
      this.renderedProjects = this.projectsBeforeDateFiltering;
      return;
    }
    this.renderedProjects = this.projectsBeforeDateFiltering.filter((project) => {
      const projectDueTo = project.dueTo?.toString();
      return projectDueTo && projectDueTo > date;
    })
  }

  private fetchAllProjects() {
    this.httpService.get('projects/available').subscribe((projects: Project[]) => {
      this.allProjects = projects.sort((a, b) => a.name.localeCompare(b.name));
      this.renderedProjects = this.allProjects;
      this.projectsBeforeDateFiltering = this.renderedProjects;
      this.fetching = false;
      this.changeDetectorRef.detectChanges();
    })
  }
}
