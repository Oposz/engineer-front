import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {QuickFiltersComponent, SortingMode} from "../shared/quick-filters/quick-filters.component";
import {ViewHeaderComponent} from "../shared/view-header/view-header.component";
import {NgScrollbar} from "ngx-scrollbar";
import {ProjectCardComponent} from "../open-projects/project-card/project-card.component";
import {TeamCardComponent} from "./team-card/team-card.component";
import {HttpService} from "../../shared/service/http.service";
import {Team} from "../../shared/constants/team";
import {LoaderComponent} from "../shared/loader/loader.component";

@Component({
  selector: 'app-your-teams',
  standalone: true,
  imports: [
    QuickFiltersComponent,
    ViewHeaderComponent,
    NgScrollbar,
    ProjectCardComponent,
    TeamCardComponent,
    LoaderComponent
  ],
  templateUrl: './your-teams.component.html',
  styleUrl: './your-teams.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class YourTeamsComponent implements OnInit {

  allTeams: Team[] = [];
  renderedTeams: Team[] = [];
  fetching = true;

  constructor(private readonly httpService: HttpService,
              private readonly changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.fetchTeams();
  }

  sortTeams(sortingMode: SortingMode) {
    if (sortingMode===SortingMode.ASCENDING){
      this.renderedTeams.sort((a, b) => a.name.localeCompare(b.name))
    } else {
      this.renderedTeams.sort((a, b) => b.name.localeCompare(a.name))
    }
    this.changeDetectorRef.detectChanges();
  }

  filterFavourites(favouritesVisible: boolean) {
    if (favouritesVisible) {
      this.renderedTeams = this.allTeams.filter((project) => project.favourite)
    } else {
      this.renderedTeams = this.allTeams;
    }
    this.changeDetectorRef.detectChanges();
  }

  filterTeamsByName(searchValue: string){
    this.renderedTeams = this.allTeams.filter((project) => project.name.includes(searchValue));
    this.changeDetectorRef.detectChanges();
  }

  private fetchTeams(){
    this.httpService.get('user/teams').subscribe((teams: Team[]) => {
      this.allTeams = teams.sort((a, b) => a.name.localeCompare(b.name))
      this.renderedTeams = this.allTeams;
      this.fetching = false;
      this.changeDetectorRef.detectChanges();
    })
  }

}
