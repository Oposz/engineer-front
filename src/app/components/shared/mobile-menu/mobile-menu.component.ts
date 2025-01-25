import {Component} from '@angular/core';
import {AsyncPipe, NgOptimizedImage} from "@angular/common";
import {NavTabComponent} from "../../menu/nav-tab/nav-tab.component";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {LocalStorageService} from "../../../shared/service/local-storage.service";
import {map, Observable} from "rxjs";
import {User} from "../../../shared/constants/user";
import {HttpService} from "../../../shared/service/http.service";
import {MatMenu, MatMenuTrigger} from "@angular/material/menu";
import {UserRole} from "../../../shared/constants/userRole";


@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NavTabComponent,
    RouterLink,
    RouterLinkActive,
    AsyncPipe,
    MatMenu,
    MatMenuTrigger
  ],
  templateUrl: './mobile-menu.component.html',
  styleUrl: './mobile-menu.component.scss'
})
export class MobileMenuComponent {
  admin = this.localStorage.getItem('uniteam-user-role')

  userName$: Observable<string> = this.httpService.get('user').pipe(
    map((user: User) => {
      return `${user.name} ${user.lastName}`
    })
  )

  constructor(
    private readonly httpService: HttpService,
    private readonly localStorage: LocalStorageService,
    private readonly router: Router
  ) {
  }

  logout() {
    this.localStorage.removeItem('uniteam-token')
    this.localStorage.removeItem('uniteam-user-id')
    this.router.navigate(['/auth']);
  }

  protected readonly UserRole = UserRole;
}
