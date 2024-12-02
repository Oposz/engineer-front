import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {QuickFiltersComponent, SortingMode} from "../shared/quick-filters/quick-filters.component";
import {ViewHeaderComponent} from "../shared/view-header/view-header.component";
import {NgScrollbar} from "ngx-scrollbar";
import {ProjectCardComponent} from "../open-projects/project-card/project-card.component";
import {UniversityCardComponent} from "./university-card/university-card.component";
import {UniversityWithProjects} from "../../shared/constants/university";
import {take} from "rxjs";
import {HttpService} from "../../shared/service/http.service";
import {LoaderComponent} from "../shared/loader/loader.component";

@Component({
  selector: 'app-universities',
  standalone: true,
  imports: [
    QuickFiltersComponent,
    ViewHeaderComponent,
    NgScrollbar,
    ProjectCardComponent,
    UniversityCardComponent,
    LoaderComponent
  ],
  templateUrl: './universities.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './universities.component.scss'
})
export class UniversitiesComponent implements OnInit {
  fetching = true;

  renderedUniversities: UniversityWithProjects[] = [];
  allUniversities: UniversityWithProjects[] = [];

  constructor(
    private readonly httpService: HttpService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.getAllUniversities();
  }

  filterFavourites(favouritesVisible: boolean) {
    if (favouritesVisible) {
      this.renderedUniversities = this.allUniversities.filter((university) => university.favourite)
    } else {
      this.renderedUniversities = this.allUniversities;
    }
    this.changeDetectorRef.detectChanges();
  }

  sortUniversities(sortingMode: SortingMode) {
    if (sortingMode === SortingMode.ASCENDING) {
      this.renderedUniversities.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      this.renderedUniversities.sort((a, b) => b.name.localeCompare(a.name));
    }
    this.changeDetectorRef.detectChanges();
  }

  filterUniversitiesByName(searchValue: string) {
    this.renderedUniversities = this.allUniversities.filter((university) => university.name.toLowerCase().includes(searchValue.toLowerCase()));
    this.changeDetectorRef.detectChanges();
  }

  private getAllUniversities() {
    this.httpService.get('universities').pipe(
      take(1)
    ).subscribe((universities: UniversityWithProjects[]) => {
      this.allUniversities = universities.sort((a, b) => a.name.localeCompare(b.name));
      this.renderedUniversities = this.allUniversities;
      this.fetching = false;
      this.changeDetectorRef.detectChanges();
    })
  }

}
