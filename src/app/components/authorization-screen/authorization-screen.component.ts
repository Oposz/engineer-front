import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {LocalStorageService} from "../../shared/service/local-storage.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpService} from "../../shared/service/http.service";
import {HttpErrorResponse} from "@angular/common/http";
import {SnackbarService} from "../../shared/service/snackbar.service";
import {SnackbarComponent, SnackbarData} from "../shared/snackbar/snackbar.component";

interface LoginForm {
  email: FormControl<string>,
  password: FormControl<string>
}

interface RegisterForm extends LoginForm {
  passwordConfirmation: FormControl<string>
}

type LoginData = {
  access_token: string;
}


@Component({
  selector: 'app-authorization-screen',
  standalone: true,
  imports: [
    RouterOutlet,
    ReactiveFormsModule
  ],
  templateUrl: './authorization-screen.component.html',
  styleUrl: './authorization-screen.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthorizationScreenComponent implements OnInit {

  loginFormFormGroup = new FormGroup<LoginForm>({
    email: new FormControl<string>('', {nonNullable: true, validators: [Validators.email, Validators.required]}),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.minLength(4), Validators.required]
    })
  })

  registerFormFormGroup = new FormGroup<RegisterForm>({
    email: new FormControl<string>('', {nonNullable: true, validators: [Validators.email, Validators.required]}),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.minLength(4), Validators.required]
    }),
    passwordConfirmation: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.minLength(4), Validators.required]
    })
  })

  singUpMode: boolean = false;
  loading: boolean = false;

  constructor(
    private readonly localStorage: LocalStorageService,
    private readonly httpService: HttpService,
    private readonly snackbarService: SnackbarService
  ) {
  }

  ngOnInit() {
  }

  submitRegistration() {
    console.log(this.registerFormFormGroup)
    if (!this.registerFormFormGroup.valid) {
      return;
    }
  }

  submitLogin() {
    if (!this.loginFormFormGroup.valid) {
      return;
    }
    this.loading = true;
    this.httpService.post('auth/login', this.loginFormFormGroup.value)
      .subscribe({
        next: (loginData: LoginData) => {
          this.localStorage.setItem('uniteam-token',loginData.access_token)
        },
        error: (e: HttpErrorResponse) => {
          if (e.status === 401){

            const data: SnackbarData = {
              message: 'Niepoprawne dane logowania',
              variant: "error"
            }

            this.snackbarService.snackbarFromComponent(SnackbarComponent, data)
          }
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      })
  }

}
