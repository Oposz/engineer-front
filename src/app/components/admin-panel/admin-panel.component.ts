import {Component} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {ViewHeaderComponent} from "../shared/view-header/view-header.component";
import {ProjectsPanelComponent} from "./panel-tabs/projects-panel/projects-panel.component";
import {PanelActionsComponent} from "./shared/panel-actions/panel-actions.component";
import {UniversitiesPanelComponent} from "./panel-tabs/universities-panel/universities-panel.component";
import {FormsModule} from "@angular/forms";

enum Tabs {
  PROJECTS,
  UNIVERSITIES,
  CARDS
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
    FormsModule
  ],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})
export class AdminPanelComponent {

  tabControl = Tabs.PROJECTS

  protected readonly Tabs = Tabs;
}
