import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {BusinessCard} from "../../../shared/constants/businessCard";
import {NgOptimizedImage} from "@angular/common";
import {PhotoComponent} from "../../shared/photo/photo.component";
import {take} from "rxjs";
import {HttpService} from "../../../shared/service/http.service";

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
export class BusinessCardComponent {
  @Input({required: true})
  cardData!: BusinessCard

  constructor(
    private readonly httpService: HttpService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
  }

  toggleFavProperty() {
    this.httpService.patch(`leaders/favourite/${this.cardData.id}`, {}).pipe(take(1)).subscribe()
    this.cardData.favourite = !this.cardData.favourite;
    this.changeDetectorRef.detectChanges();
  }

}
