import {Component} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";
import {NgScrollbar} from "ngx-scrollbar";

@Component({
  selector: 'app-team-details',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink,
    NgScrollbar
  ],
  templateUrl: './team-details.component.html',
  styleUrl: './team-details.component.scss'
})
export class TeamDetailsComponent {

}
