import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {NgScrollbar} from "ngx-scrollbar";
import {QuickFiltersComponent, SortingMode} from "../shared/quick-filters/quick-filters.component";
import {ViewHeaderComponent} from "../shared/view-header/view-header.component";
import {LeaderCard} from "../../shared/constants/leaderCard";
import {BusinessCardComponent} from "./business-card/business-card.component";
import {take} from "rxjs";
import {HttpService} from "../../shared/service/http.service";
import {UserFavouritesService} from "../../shared/service/user-favourites.service";
import {LoaderComponent} from "../shared/loader/loader.component";

@Component({
  selector: 'app-business-cards',
  standalone: true,
  imports: [
    NgScrollbar,
    QuickFiltersComponent,
    ViewHeaderComponent,
    BusinessCardComponent,
    LoaderComponent
  ],
  templateUrl: './business-cards.component.html',
  styleUrl: './business-cards.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BusinessCardsComponent implements OnInit {
  fetching = true;
  renderedCards: LeaderCard[] = []
  allBusinessCards: LeaderCard[] = [];

  constructor(private readonly httpService: HttpService,
              private readonly changeDetectorRef: ChangeDetectorRef,
              private readonly userFavouritesService: UserFavouritesService
  ) {
  }

  ngOnInit() {
    this.getAllLeaders()
  }

  filterFavourites(favouritesVisible: boolean) {
    const userFavs = this.userFavouritesService.getUserFavs();
    if (favouritesVisible && userFavs) {
      this.renderedCards = this.allBusinessCards.filter((leaderCard) =>
        userFavs.includes(leaderCard.id)
      );
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
    ).subscribe((businessCards: LeaderCard[]) => {
      this.allBusinessCards = businessCards.sort((a, b) => a.name.localeCompare(b.name));
      this.renderedCards = this.allBusinessCards;
      this.fetching = false;
      this.changeDetectorRef.detectChanges();
    })
  }

}
