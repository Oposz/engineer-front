import {Component} from '@angular/core';
import {AsyncPipe, JsonPipe, NgOptimizedImage} from "@angular/common";
import {NavTabComponent} from "./nav-tab/nav-tab.component";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {HttpService} from "../../shared/service/http.service";
import {map, Observable} from "rxjs";
import {User} from "../../shared/constants/user";
import {LocalStorageService} from "../../shared/service/local-storage.service";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatButton} from "@angular/material/button";
import {UserRole} from "../../shared/constants/userRole";

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NavTabComponent,
    RouterLink,
    RouterLinkActive,
    AsyncPipe,
    JsonPipe,
    MatMenuTrigger,
    MatButton,
    MatMenu,
    MatMenuItem
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {

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
