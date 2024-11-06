import {Component} from '@angular/core';
import {NgScrollbar} from "ngx-scrollbar";
import {QuickFiltersComponent} from "../shared/quick-filters/quick-filters.component";
import {UniversityCardComponent} from "../universities/university-card/university-card.component";
import {ViewHeaderComponent} from "../shared/view-header/view-header.component";
import {ProjectCardComponent} from "../open-projects/project-card/project-card.component";
import * as mockData from "../open-projects/mock-projects.json";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-university-view',
  standalone: true,
  imports: [
    NgScrollbar,
    QuickFiltersComponent,
    UniversityCardComponent,
    ViewHeaderComponent,
    ProjectCardComponent,
    RouterLink
  ],
  templateUrl: './university-view.component.html',
  styleUrl: './university-view.component.scss'
})
export class UniversityViewComponent {

  data: any = mockData.cards;


}
