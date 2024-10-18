import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {Router, RouterOutlet} from "@angular/router";
import {LocalStorageService} from "../../shared/service/local-storage.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpService} from "../../shared/service/http.service";
import {HttpErrorResponse} from "@angular/common/http";
import {SnackbarService} from "../../shared/service/snackbar.service";
import {SnackbarComponent, SnackbarData} from "../shared/snackbar/snackbar.component";
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInput} from "@angular/material/input";
import {NgScrollbar} from "ngx-scrollbar";
import {startWith, take} from "rxjs";
import {University} from "../../shared/constants/university";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

interface LoginForm {
  email: FormControl<string>,
  password: FormControl<string>
}

interface RegisterForm extends LoginForm {
  passwordConfirmation: FormControl<string>,
  name: FormControl<string>,
  lastName: FormControl<string>,
  university: FormControl<string>
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
    MatInput,
    NgScrollbar
  ],
  templateUrl: './authorization-screen.component.html',
  styleUrl: './authorization-screen.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthorizationScreenComponent implements OnInit {

  destroyRef = inject(DestroyRef)

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
      university: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]})
    }
  )

  singUpMode: boolean = false;
  loading: boolean = false;

  universities: University[] = []
  filteredUniversities: University[] = [];

  constructor(
    private readonly localStorage: LocalStorageService,
    private readonly httpService: HttpService,
    private readonly snackbarService: SnackbarService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly router: Router
  ) {
  }

  ngOnInit() {
    this.getAllUniversities()
    this.observeAutocompleteFilter()
  }

  submitRegistration() {
    if (!this.passwordsMatching()) {
      // TODO Live form validation for password confirmations
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
          this.handleError(e);
        }
      })
  }


  private getAllUniversities() {
    this.httpService.get('universities').pipe(
      take(1)
    ).subscribe((universities: University[]) => {
      this.universities = universities;
      this.filteredUniversities = universities;
      this.changeDetectorRef.detectChanges();
    })
  }

  private observeAutocompleteFilter() {
    this.registerFormFormGroup.controls.university.valueChanges.pipe(
      startWith(''),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((value) => {
      this.filteredUniversities = this.universities.filter(
        university => university.name.toLowerCase().includes(value.toLowerCase())
      )
    })
  }

  private passwordsMatching() {
    return this.registerFormFormGroup.controls.password.value === this.registerFormFormGroup.controls.passwordConfirmation.value
  }

  private handleError(e: HttpErrorResponse) {
    let data: SnackbarData = {
      message: 'Ups! Coś poszło nie tak :(',
      variant: "error",
      closeButton: true
    }

    if (e.status === 401) {
      data = {
        message: 'Niepoprawne dane logowania',
        variant: "error",
        closeButton: true
      }
    }

    this.snackbarService.snackbarFromComponent(SnackbarComponent, data)
    this.loading = false;
    this.changeDetectorRef.detectChanges()
  }
}
