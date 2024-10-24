import {Component} from '@angular/core';
import {AsyncPipe, JsonPipe, NgOptimizedImage} from "@angular/common";
import {NavTabComponent} from "./nav-tab/nav-tab.component";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {HttpService} from "../../shared/service/http.service";
import {map, Observable} from "rxjs";
import {User} from "../../shared/constants/user";

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NavTabComponent,
    RouterLink,
    RouterLinkActive,
    AsyncPipe,
    JsonPipe
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {

  userName$: Observable<string> = this.httpService.get('users/me').pipe(
    map((user: User) => {
      return `${user.name} ${user.lastName}`
    })
  )

  constructor(
    private readonly httpService: HttpService
  ) {
  }

}
