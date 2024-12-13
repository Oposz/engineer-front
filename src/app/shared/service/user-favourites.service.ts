import {Injectable} from '@angular/core';
import {HttpService} from "./http.service";

@Injectable({
  providedIn: 'root'
})
export class UserFavouritesService {

  private userFavs: string[] = []

  constructor(
    private readonly httpService: HttpService
  ) {
  }

  initUserFav() {
    if (this.userFavs.length !== 0) {
      return;
    }
    this.httpService.get('user/favourites')
      .subscribe((data: { favourites: string[] }) => {
        if (data){
          this.userFavs = data.favourites
        }
      })
  }

  getUserFavs() {
    return this.userFavs;
  }

  setUserFavs(favs: string[]) {
    this.userFavs = favs;
  }

  reset() {
    this.userFavs = [];
  }
}
