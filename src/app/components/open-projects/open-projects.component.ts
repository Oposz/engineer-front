import {Component} from '@angular/core';
import {ViewHeaderComponent} from "../shared/view-header/view-header.component";
import {QuickFiltersComponent} from "../shared/quick-filters/quick-filters.component";
import * as mockData from './mock-projects.json'
import {ProjectCardComponent} from "./project-card/project-card.component";
import {Project} from "../../shared/constants/project";
import {NgScrollbar} from "ngx-scrollbar";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-open-projects',
  standalone: true,
  imports: [
    ViewHeaderComponent,
    QuickFiltersComponent,
    ProjectCardComponent,
    NgScrollbar,
    RouterLink
  ],
  templateUrl: './open-projects.component.html',
  styleUrl: './open-projects.component.scss'
})
export class OpenProjectsComponent {

  data: Project[] = mockData.cards;

}
