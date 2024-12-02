import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {NgScrollbar} from "ngx-scrollbar";
import {QuickFiltersComponent} from "../shared/quick-filters/quick-filters.component";
import {UniversityCardComponent} from "../universities/university-card/university-card.component";
import {ViewHeaderComponent} from "../shared/view-header/view-header.component";
import {ProjectCardComponent} from "../open-projects/project-card/project-card.component";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {LoaderComponent} from "../shared/loader/loader.component";
import {HttpService} from "../../shared/service/http.service";
import {take} from "rxjs";
import {UniversityWithProjects} from "../../shared/constants/university";

@Component({
  selector: 'app-university-view',
  standalone: true,
  imports: [
    NgScrollbar,
    QuickFiltersComponent,
    UniversityCardComponent,
    ViewHeaderComponent,
    ProjectCardComponent,
    RouterLink,
    LoaderComponent
  ],
  templateUrl: './university-view.component.html',
  styleUrl: './university-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class UniversityViewComponent implements OnInit {

  fetching = true
  university!: UniversityWithProjects;
  private universityId: string = ''

  constructor(private readonly httpService: HttpService,
              private readonly route: ActivatedRoute,
              private readonly changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.getUniversityId();
    this.fetchUniversityProjects();
  }

  private getUniversityId() {
    this.route.params.pipe(
      take(1)
    ).subscribe((params) => {
      this.universityId = params['id'];
    })
  }

  private fetchUniversityProjects() {
    this.httpService.get(`universities/${this.universityId}`).subscribe((university: UniversityWithProjects) => {
      this.university = university
      this.fetching = false;
      this.changeDetectorRef.detectChanges()
    });
  }

}
