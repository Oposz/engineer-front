import {Component} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {MobileMenuComponent} from "../shared/mobile-menu/mobile-menu.component";
import {MenuComponent} from "../menu/menu.component";

@Component({
  selector: 'app-main-app',
  standalone: true,
  imports: [
    RouterOutlet,
    MobileMenuComponent,
    MenuComponent
  ],
  templateUrl: './main-app.component.html',
  styleUrl: './main-app.component.scss'
})
export class MainAppComponent {

}
