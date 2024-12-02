import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {UniversityWithProjects} from "../../../shared/constants/university";
import {NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";
import {PhotoComponent} from "../../shared/photo/photo.component";
import {take} from "rxjs";
import {HttpService} from "../../../shared/service/http.service";

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
export class UniversityCardComponent {

  @Input({required: true})
  university!: UniversityWithProjects

  @Input()
  withFavouriteFeature: boolean = true;

  constructor(private readonly httpService: HttpService, private readonly changeDetectorRef: ChangeDetectorRef) {
  }

  toggleFavProperty() {
    this.httpService.patch(`universities/favourite/${this.university.id}`, {}).pipe(take(1)).subscribe()
    this.university.favourite = !this.university.favourite;
    this.changeDetectorRef.detectChanges();
  }

}
