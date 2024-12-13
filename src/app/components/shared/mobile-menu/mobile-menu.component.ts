import {Component} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {NavTabComponent} from "../../menu/nav-tab/nav-tab.component";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {UserRole} from "../../../shared/constants/userRole";
import {LocalStorageService} from "../../../shared/service/local-storage.service";

@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NavTabComponent,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './mobile-menu.component.html',
  styleUrl: './mobile-menu.component.scss'
})
export class MobileMenuComponent {
  admin = this.localStorage.getItem('uniteam-user-role')

  protected readonly UserRole = UserRole;

  constructor(
    private readonly localStorage: LocalStorageService
  ) {
  }
}
