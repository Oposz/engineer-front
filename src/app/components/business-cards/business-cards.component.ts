import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {NgScrollbar} from "ngx-scrollbar";
import {ProjectCardComponent} from "../open-projects/project-card/project-card.component";
import {QuickFiltersComponent} from "../shared/quick-filters/quick-filters.component";
import {ViewHeaderComponent} from "../shared/view-header/view-header.component";
import {BusinessCard} from "../../shared/constants/businessCard";
import {BusinessCardComponent} from "./business-card/business-card.component";
import {take} from "rxjs";
import {HttpService} from "../../shared/service/http.service";

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
  styleUrl: './business-cards.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BusinessCardsComponent implements OnInit {

  businessCards: BusinessCard[] = [];

  constructor(private readonly httpService: HttpService,
              private readonly changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.getAllLeaders()
  }

  private getAllLeaders() {
    this.httpService.get('leaders').pipe(
      take(1)
    ).subscribe((businessCards: BusinessCard[]) => {
      this.businessCards = businessCards;
      this.changeDetectorRef.detectChanges();
    })
  }

}
