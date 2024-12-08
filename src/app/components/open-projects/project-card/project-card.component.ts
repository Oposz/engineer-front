import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Project} from "../../../shared/constants/project";
import {NgClass, NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";
import {getDate, getRemainingDays} from "../../../utils/date";
import {take} from "rxjs";
import {HttpService} from "../../../shared/service/http.service";
import {PhotoComponent} from "../../shared/photo/photo.component";
import {UserFavouritesService} from "../../../shared/service/user-favourites.service";

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink,
    NgClass,
    PhotoComponent
  ],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss'
})
export class ProjectCardComponent implements OnInit {

  @Input({required: true})
  project!: Project

  isFavourite = false;

  protected readonly getDate = getDate;
  protected readonly getRemainingDays = getRemainingDays;

  constructor(private readonly httpService: HttpService,
              private readonly changeDetectorRef: ChangeDetectorRef,
              private readonly userFavouritesService: UserFavouritesService
  ) {
  }

  ngOnInit() {
    this.isFavourite = this.userFavouritesService.getUserFavs().includes(this.project.id)
  }

  toggleFavProperty() {
    this.httpService.patch(`user/favourite/${this.project.id}`, {})
      .pipe(take(1))
      .subscribe((data: { favourites: string[] }) => {
        this.userFavouritesService.setUserFavs(data.favourites);
        this.isFavourite = this.userFavouritesService.getUserFavs().includes(this.project.id)
        this.changeDetectorRef.detectChanges();
      })
  }

}
