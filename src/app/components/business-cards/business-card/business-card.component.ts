import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {LeaderCard} from "../../../shared/constants/leaderCard";
import {NgOptimizedImage} from "@angular/common";
import {PhotoComponent} from "../../shared/photo/photo.component";
import {take} from "rxjs";
import {HttpService} from "../../../shared/service/http.service";
import {UserFavouritesService} from "../../../shared/service/user-favourites.service";

@Component({
  selector: 'app-business-card',
  standalone: true,
  imports: [
    NgOptimizedImage,
    PhotoComponent
  ],
  templateUrl: './business-card.component.html',
  styleUrl: './business-card.component.scss'
})
export class BusinessCardComponent implements OnInit {
  @Input({required: true})
  cardData!: LeaderCard

  isFavourite = false;


  constructor(
    private readonly httpService: HttpService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly userFavouritesService: UserFavouritesService
  ) {
  }

  ngOnInit() {
    this.isFavourite = this.userFavouritesService.getUserFavs().includes(this.cardData.id)
  }

  toggleFavProperty() {
    this.httpService.patch(`user/favourite/${this.cardData.id}`, {})
      .pipe(take(1))
      .subscribe((data: { favourites: string[] }) => {
        this.userFavouritesService.setUserFavs(data.favourites);
        this.isFavourite = this.userFavouritesService.getUserFavs().includes(this.cardData.id)
        this.changeDetectorRef.detectChanges();
      })
  }

}
