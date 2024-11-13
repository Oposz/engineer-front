import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {Project} from "../../../shared/constants/project";
import {NgClass, NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";
import {getDate, getRemainingDays} from "../../../utils/date";
import {take} from "rxjs";
import {HttpService} from "../../../shared/service/http.service";

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink,
    NgClass
  ],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss'
})
export class ProjectCardComponent {

  @Input({required: true})
  project!: Project

  protected readonly getDate = getDate;
  protected readonly getRemainingDays = getRemainingDays;

  constructor(private readonly httpService: HttpService,
              private readonly changeDetectorRef: ChangeDetectorRef) {
  }

  toggleFavProperty() {
    this.httpService.patch(`projects/favourite/${this.project.id}`, {}).pipe(take(1)).subscribe()
    this.project.favourite = !this.project.favourite;
    this.changeDetectorRef.detectChanges();
  }

}
