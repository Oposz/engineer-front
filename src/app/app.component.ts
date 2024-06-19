import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MenuComponent} from "./components/menu/menu.component";
import {MobileMenuComponent} from "./components/mobile-menu/mobile-menu.component";

@Component({
  selector: 'app-root',
  standalone: true,
    imports: [RouterOutlet, MenuComponent, MobileMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'inzynier-front';
}
