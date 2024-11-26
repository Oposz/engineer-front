import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {NgScrollbar} from "ngx-scrollbar";
import {ProjectCardComponent} from "../open-projects/project-card/project-card.component";
import {QuickFiltersComponent, SortingMode} from "../shared/quick-filters/quick-filters.component";
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

  renderedCards: BusinessCard[] = []
  allBusinessCards: BusinessCard[] = [];

  constructor(private readonly httpService: HttpService,
              private readonly changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.getAllLeaders()
  }

  filterFavourites(favouritesVisible: boolean) {
    if (favouritesVisible) {
      this.renderedCards = this.allBusinessCards.filter((card) => card.favourite)
    } else {
      this.renderedCards = this.allBusinessCards;
    }
    this.changeDetectorRef.detectChanges();
  }

  sortCards(sortingMode: SortingMode) {
    if (sortingMode === SortingMode.ASCENDING) {
      this.renderedCards.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      this.renderedCards.sort((a, b) => b.name.localeCompare(a.name));
    }
    this.changeDetectorRef.detectChanges();
  }

  filterCardsByName(searchValue: string) {
    this.renderedCards = this.allBusinessCards.filter((card) => {
        const cardName = `${card.name} ${card.lastName}`
        return cardName.toLowerCase().includes(searchValue.toLowerCase())
      }
    )
    ;
    this.changeDetectorRef.detectChanges();
  }

  private getAllLeaders() {
    this.httpService.get('leaders').pipe(
      take(1)
    ).subscribe((businessCards: BusinessCard[]) => {
      this.allBusinessCards = businessCards.sort((a, b) => a.name.localeCompare(b.name));
      this.renderedCards = this.allBusinessCards;
      this.changeDetectorRef.detectChanges();
    })
  }

}
