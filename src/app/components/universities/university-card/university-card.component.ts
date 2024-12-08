import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {UniversityWithProjects} from "../../../shared/constants/university";
import {NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";
import {PhotoComponent} from "../../shared/photo/photo.component";
import {take} from "rxjs";
import {HttpService} from "../../../shared/service/http.service";
import {UserFavouritesService} from "../../../shared/service/user-favourites.service";

@Component({
  selector: 'app-university-card',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink,
    PhotoComponent
  ],
  templateUrl: './university-card.component.html',
  styleUrl: './university-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UniversityCardComponent implements OnInit {

  @Input({required: true})
  university!: UniversityWithProjects

  @Input()
  withFavouriteFeature: boolean = true;

  isFavourite = false;

  constructor(
    private readonly httpService: HttpService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly userFavouritesService: UserFavouritesService
  ) {
  }

  ngOnInit() {
    this.isFavourite = this.userFavouritesService.getUserFavs().includes(this.university.id)
  }

  toggleFavProperty() {
    this.httpService.patch(`user/favourite/${this.university.id}`, {})
      .pipe(take(1))
      .subscribe((data: { favourites: string[] }) => {
        this.userFavouritesService.setUserFavs(data.favourites);
        this.isFavourite = this.userFavouritesService.getUserFavs().includes(this.university.id)
        this.changeDetectorRef.detectChanges();
      })
  }

}
