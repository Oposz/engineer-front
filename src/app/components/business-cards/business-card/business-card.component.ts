import {Component, Input} from '@angular/core';
import {BusinessCard} from "../../../shared/constants/businessCard";

@Component({
  selector: 'app-business-card',
  standalone: true,
  imports: [],
  templateUrl: './business-card.component.html',
  styleUrl: './business-card.component.scss'
})
export class BusinessCardComponent {
  @Input({required: true})
  cardData!: BusinessCard

}
