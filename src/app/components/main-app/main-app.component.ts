import {Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {MobileMenuComponent} from "../shared/mobile-menu/mobile-menu.component";
import {MenuComponent} from "../menu/menu.component";
import {UserFavouritesService} from "../../shared/service/user-favourites.service";

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
export class MainAppComponent implements OnInit {

  userFavsService = inject(UserFavouritesService);

  ngOnInit() {
    this.userFavsService.initUserFav();
  }
}
