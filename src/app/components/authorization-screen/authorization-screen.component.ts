import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router, RouterOutlet} from "@angular/router";
import {LocalStorageService} from "../../shared/service/local-storage.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpService} from "../../shared/service/http.service";
import {HttpErrorResponse} from "@angular/common/http";
import {SnackbarService} from "../../shared/service/snackbar.service";
import {SnackbarComponent, SnackbarData} from "../shared/snackbar/snackbar.component";
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInput} from "@angular/material/input";


interface LoginForm {
  email: FormControl<string>,
  password: FormControl<string>
}

interface RegisterForm extends LoginForm {
  passwordConfirmation: FormControl<string>,
  name: FormControl<string>,
  lastName: FormControl<string>,
  university: any
}

type LoginData = {
  access_token: string;
}


@Component({
  selector: 'app-authorization-screen',
  standalone: true,
  imports: [
    RouterOutlet,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInput
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
    }),
    name: new FormControl<string>('', {nonNullable: true, validators: [Validators.minLength(3), Validators.required]}),
    lastName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.minLength(2), Validators.required]
    }),
    university: new FormControl('')
  })

  singUpMode: boolean = false;
  loading: boolean = false;

  dummy = ['dpa', 'dupa']

  constructor(
    private readonly localStorage: LocalStorageService,
    private readonly httpService: HttpService,
    private readonly snackbarService: SnackbarService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly router: Router
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
          this.localStorage.setItem('uniteam-token', loginData.access_token)
          this.loading = false;
          this.changeDetectorRef.detectChanges();
          this.router.navigate([''])
        },
        error: (e: HttpErrorResponse) => {
          if (e.status === 401) {

            const data: SnackbarData = {
              message: 'Niepoprawne dane logowania',
              variant: "error",
              closeButton: true
            }

            this.snackbarService.snackbarFromComponent(SnackbarComponent, data)
          }
          this.loading = false;
          this.changeDetectorRef.detectChanges()
        }
      })
  }

}
