import {Component} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {NewPositionComponent} from "./new-position/new-position.component";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatInput, MatSuffix} from "@angular/material/input";

@Component({
  selector: 'app-add-new-project',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NewPositionComponent,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatInput,
    MatSuffix
  ],
  templateUrl: './add-new-project.component.html',
  styleUrl: './add-new-project.component.scss'
})
export class AddNewProjectComponent {

}
