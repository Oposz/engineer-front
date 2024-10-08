import {Component} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {NavTabComponent} from "./nav-tab/nav-tab.component";
import {RouterLink, RouterLinkActive} from "@angular/router";

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NavTabComponent,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {

}
