import {Component} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {ViewHeaderComponent} from "../shared/view-header/view-header.component";
import {ProjectsPanelComponent} from "./panel-tabs/projects-panel/projects-panel.component";
import {PanelActionsComponent} from "./shared/panel-actions/panel-actions.component";
import {UniversitiesPanelComponent} from "./panel-tabs/universities-panel/universities-panel.component";
import {FormsModule} from "@angular/forms";
import {LeadersPanelComponent} from "./panel-tabs/leaders-panel/leaders-panel.component";

enum Tabs {
  PROJECTS,
  UNIVERSITIES,
  LEADERS
}

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    RouterOutlet,
    ViewHeaderComponent,
    ProjectsPanelComponent,
    PanelActionsComponent,
    UniversitiesPanelComponent,
    FormsModule,
    LeadersPanelComponent
  ],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})
export class AdminPanelComponent {

  tabControl = Tabs.PROJECTS

  protected readonly Tabs = Tabs;
}
