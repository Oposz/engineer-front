import {Component} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {BreadcrumbsComponent} from "../shared/breadcrumbs/breadcrumbs.component";
import {RouterLink} from "@angular/router";
import {NgScrollbar} from "ngx-scrollbar";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatInput, MatSuffix} from "@angular/material/input";

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [
    NgOptimizedImage,
    BreadcrumbsComponent,
    RouterLink,
    NgScrollbar,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatInput,
    MatSuffix
  ],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss'
})
export class ProjectDetailsComponent {

}
