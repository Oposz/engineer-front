import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {NgScrollbar} from "ngx-scrollbar";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogClose, MatDialogRef} from "@angular/material/dialog";
import {University} from "../../../shared/constants/university";
import {startWith, take} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {HttpService} from "../../../shared/service/http.service";
import {NgOptimizedImage} from "@angular/common";
import {ModalOutcome} from "../../../shared/constants/modalOutcome";
import {HttpErrorResponse} from "@angular/common/http";
import {SnackbarComponent, SnackbarData} from "../../shared/snackbar/snackbar.component";
import {SnackbarService} from "../../../shared/service/snackbar.service";

@Component({
  selector: 'app-connect-new-university',
  standalone: true,
  imports: [
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatOption,
    NgScrollbar,
    ReactiveFormsModule,
    FormsModule,
    MatDialogClose,
    NgOptimizedImage
  ],
  templateUrl: './connect-new-university.component.html',
  styleUrl: './connect-new-university.component.scss'
})
export class ConnectNewUniversityComponent implements OnInit {
  loading: boolean = false;
  filteredUniversities: University[] = [];
  universities: University[] = []
  universityControl: FormControl<string> = new FormControl('', {nonNullable: true})
  destroyRef = inject(DestroyRef)

  readonly dialogData: { universities: University[] } = inject(MAT_DIALOG_DATA);
  readonly ModalOutcome = ModalOutcome;
  readonly dialogRef = inject(MatDialogRef<ConnectNewUniversityComponent>);


  constructor(
    private readonly httpService: HttpService,
    private readonly snackbarService: SnackbarService,
  ) {
  }

  ngOnInit() {
    this.getAllUniversities();
    this.observeAutocompleteFilter();
  }

  connectUniversity() {
    this.loading = true
    const uniToConnect = this.universities.find((_university) => _university.name === this.universityControl.value)?.id
    if (!uniToConnect) return;
    this.httpService.post('users/connect-university', {universityId: uniToConnect}).pipe(
      take(1)
    ).subscribe({
      next: () => {
        this.dialogRef.close(ModalOutcome.SUCCESS);
        this.loading = false;
      },
      error: (e: HttpErrorResponse) => {
        this.handleError(e);
      }
    })
  }

  private observeAutocompleteFilter() {
    this.universityControl.valueChanges.pipe(
      startWith(''),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((value) => {
      this.filteredUniversities = this.universities.filter(
        university => university.name.toLowerCase().includes(value.toLowerCase())
      )
    })
  }

  private getAllUniversities() {
    this.httpService.get('universities').pipe(
      take(1)
    ).subscribe((universities: University[]) => {
      const availableUniversities = universities.filter(
        university => !this.dialogData.universities.map((alreadyPickedUni) => alreadyPickedUni.id).includes(university.id)
      )
      this.universities = availableUniversities
      this.filteredUniversities = availableUniversities;
    })
  }

  private handleError(e: HttpErrorResponse) {
    let data: SnackbarData = {
      message: 'Ups! Coś poszło nie tak :(',
      variant: "error",
      closeButton: true
    }

    this.snackbarService.snackbarFromComponent(SnackbarComponent, data)
    this.loading = false;
  }
}
