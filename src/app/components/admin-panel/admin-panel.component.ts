import {Component} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {ViewHeaderComponent} from "../shared/view-header/view-header.component";
import {ProjectsPanelComponent} from "./panel-tabs/projects-panel/projects-panel.component";
import {PanelActionsComponent} from "./shared/panel-actions/panel-actions.component";

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    RouterOutlet,
    ViewHeaderComponent,
    ProjectsPanelComponent,
    PanelActionsComponent
  ],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})
export class AdminPanelComponent {

}
