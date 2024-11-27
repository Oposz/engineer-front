import {Component} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-panel-actions',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './panel-actions.component.html',
  styleUrl: './panel-actions.component.scss'
})
export class PanelActionsComponent {

}
