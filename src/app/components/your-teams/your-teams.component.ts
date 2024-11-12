import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {QuickFiltersComponent} from "../shared/quick-filters/quick-filters.component";
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

  teams: Team[] = [];
  fetching = true;

  constructor(private readonly httpService: HttpService,
              private readonly changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.httpService.get('user/teams').subscribe((teams: Team[]) => {
      this.teams = teams;
      this.fetching = false;
      this.changeDetectorRef.detectChanges();
    })
  }

}
