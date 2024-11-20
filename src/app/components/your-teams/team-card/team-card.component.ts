import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {NgClass, NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";
import {getDate, getRemainingDays} from "../../../utils/date";
import {Team} from "../../../shared/constants/team";
import {HttpService} from "../../../shared/service/http.service";
import {take} from "rxjs";
import {PhotoComponent} from "../../shared/photo/photo.component";

@Component({
  selector: 'app-team-card',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink,
    NgClass,
    PhotoComponent
  ],
  templateUrl: './team-card.component.html',
  styleUrl: './team-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamCardComponent {

  @Input({required: true})
  team!: Team;

  protected readonly getDate = getDate;
  protected readonly getRemainingDays = getRemainingDays;

  constructor(private readonly httpService: HttpService,
              private readonly changeDetectorRef: ChangeDetectorRef) {
  }

  toggleFavProperty() {
    this.httpService.patch(`projects/favourite/${this.team.id}`, {}).pipe(take(1)).subscribe()
    this.team.favourite = !this.team.favourite;
    this.changeDetectorRef.detectChanges();
  }

}
