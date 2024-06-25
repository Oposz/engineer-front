import {Component} from '@angular/core';
import {QuickFiltersComponent} from "../shared/quick-filters/quick-filters.component";
import {ViewHeaderComponent} from "../shared/view-header/view-header.component";
import {NgScrollbar} from "ngx-scrollbar";
import {ProjectCardComponent} from "../open-projects/project-card/project-card.component";
import * as mockData from "./mock-team.json";
import {TeamCardComponent} from "./team-card/team-card.component";
import {Team} from "../../shared/constants/team";

@Component({
  selector: 'app-your-teams',
  standalone: true,
  imports: [
    QuickFiltersComponent,
    ViewHeaderComponent,
    NgScrollbar,
    ProjectCardComponent,
    TeamCardComponent
  ],
  templateUrl: './your-teams.component.html',
  styleUrl: './your-teams.component.scss'
})
export class YourTeamsComponent {

  data: Team[] = mockData.teams;

}
