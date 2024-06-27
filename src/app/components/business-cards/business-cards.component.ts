import {Component} from '@angular/core';
import {NgScrollbar} from "ngx-scrollbar";
import {ProjectCardComponent} from "../open-projects/project-card/project-card.component";
import {QuickFiltersComponent} from "../shared/quick-filters/quick-filters.component";
import {ViewHeaderComponent} from "../shared/view-header/view-header.component";
import * as mockData from "./mock-cards.json";
import {BusinessCard} from "../../shared/constants/businessCard";
import {BusinessCardComponent} from "./business-card/business-card.component";

@Component({
  selector: 'app-business-cards',
  standalone: true,
  imports: [
    NgScrollbar,
    ProjectCardComponent,
    QuickFiltersComponent,
    ViewHeaderComponent,
    BusinessCardComponent
  ],
  templateUrl: './business-cards.component.html',
  styleUrl: './business-cards.component.scss'
})
export class BusinessCardsComponent {

  data: BusinessCard[] = mockData.businessCards;


}
