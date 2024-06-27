import {Component, Input} from '@angular/core';
import {University} from "../../../shared/constants/university";
import {NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-university-card',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink
  ],
  templateUrl: './university-card.component.html',
  styleUrl: './university-card.component.scss'
})
export class UniversityCardComponent {

  @Input({required: true})
  university!: University

}
