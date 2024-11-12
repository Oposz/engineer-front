import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {QuickFiltersComponent} from "../shared/quick-filters/quick-filters.component";
import {ViewHeaderComponent} from "../shared/view-header/view-header.component";
import {NgScrollbar} from "ngx-scrollbar";
import {ProjectCardComponent} from "../open-projects/project-card/project-card.component";
import {UniversityCardComponent} from "./university-card/university-card.component";
import {University} from "../../shared/constants/university";
import {take} from "rxjs";
import {HttpService} from "../../shared/service/http.service";

@Component({
  selector: 'app-universities',
  standalone: true,
  imports: [
    QuickFiltersComponent,
    ViewHeaderComponent,
    NgScrollbar,
    ProjectCardComponent,
    UniversityCardComponent
  ],
  templateUrl: './universities.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './universities.component.scss'
})
export class UniversitiesComponent implements OnInit {

  universities: University[] = [];

  constructor(
    private readonly httpService:HttpService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.getAllUniversities();
  }


  private getAllUniversities() {
    this.httpService.get('universities').pipe(
      take(1)
    ).subscribe((universities: University[]) => {
      this.universities = universities;
      this.changeDetectorRef.detectChanges();
    })
  }

}
