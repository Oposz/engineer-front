import {Component, Input} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";
import {getDate, getRemainingDays} from "../../../utils/date";
import {Team} from "../../../shared/constants/team";

@Component({
  selector: 'app-team-card',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink
  ],
  templateUrl: './team-card.component.html',
  styleUrl: './team-card.component.scss'
})
export class TeamCardComponent {

  @Input({required: true})
  team!: Team;

  protected readonly getDate = getDate;
  protected readonly getRemainingDays = getRemainingDays;
}
