import {Component, OnInit} from '@angular/core';
import {Router, RouterOutlet} from "@angular/router";
import {LocalStorageService} from "../../shared/service/local-storage.service";

@Component({
  selector: 'app-authorization-screen',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './authorization-screen.component.html',
  styleUrl: './authorization-screen.component.scss'
})
export class AuthorizationScreenComponent implements OnInit{
constructor(private readonly localStorage: LocalStorageService,
            private readonly router: Router) {
}

  ngOnInit() {
    // this.localStorage.setItem('user', 'dupa')
    // this.router.navigate([''])
  }


}
