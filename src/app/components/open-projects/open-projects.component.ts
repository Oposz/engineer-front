import { Component } from '@angular/core';
import {ViewHeaderComponent} from "../shared/view-header/view-header.component";
import {QuickFiltersComponent} from "../shared/quick-filters/quick-filters.component";

@Component({
  selector: 'app-open-projects',
  standalone: true,
    imports: [
        ViewHeaderComponent,
        QuickFiltersComponent
    ],
  templateUrl: './open-projects.component.html',
  styleUrl: './open-projects.component.scss'
})
export class OpenProjectsComponent {

}
