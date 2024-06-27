import {Component, Input} from '@angular/core';
import {BusinessCard} from "../../../shared/constants/businessCard";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-business-card',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './business-card.component.html',
  styleUrl: './business-card.component.scss'
})
export class BusinessCardComponent {
  @Input({required: true})
  cardData!: BusinessCard

}
