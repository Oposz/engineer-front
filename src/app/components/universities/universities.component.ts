import {Component} from '@angular/core';
import {QuickFiltersComponent} from "../shared/quick-filters/quick-filters.component";
import {ViewHeaderComponent} from "../shared/view-header/view-header.component";
import {NgScrollbar} from "ngx-scrollbar";
import {ProjectCardComponent} from "../open-projects/project-card/project-card.component";
import {UniversityCardComponent} from "./university-card/university-card.component";
import * as mockData from "./mock-universities.json";
import {University} from "../../shared/constants/university";

@Component({
  selector: 'app-universities',
  standalone: true,
  imports: [
    QuickFiltersComponent,
    ViewHeaderComponent,
    NgScrollbar,
    ProjectCardComponent,
    UniversityCardComponent
  ],
  templateUrl: './universities.component.html',
  styleUrl: './universities.component.scss'
})
export class UniversitiesComponent {

  data: University[] = mockData.universities;


}
