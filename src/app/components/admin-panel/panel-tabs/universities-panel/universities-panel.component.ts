import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {MatMenu, MatMenuContent, MatMenuTrigger} from "@angular/material/menu";
import {NgOptimizedImage} from "@angular/common";
import {DetailedUniversity} from "../../../../shared/constants/university";
import {RouterLink} from "@angular/router";
import {HttpService} from "../../../../shared/service/http.service";
import {SnackbarComponent, SnackbarData} from "../../../shared/snackbar/snackbar.component";
import {HttpErrorResponse} from "@angular/common/http";
import {SnackbarService} from "../../../../shared/service/snackbar.service";
import {MatDialog} from "@angular/material/dialog";
import {AddEditUniversityModalComponent} from "./add-edit-university-modal/add-edit-university-modal.component";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ModalOutcome} from "../../../../shared/constants/modalOutcome";

type ModalOutComeWithData = {
  result: ModalOutcome,
  data: DetailedUniversity
}

@Component({
  selector: 'app-universities-panel',
  standalone: true,
  imports: [
    MatMenu,
    MatMenuContent,
    NgOptimizedImage,
    MatMenuTrigger,
    RouterLink
  ],
  templateUrl: './universities-panel.component.html',
  styleUrl: './universities-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UniversitiesPanelComponent implements OnInit {

  universities: DetailedUniversity[] = []
  universitiesToModify: string[] = []
  readonly dialog = inject(MatDialog);
  readonly destroyRef = inject(DestroyRef);


  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly httpService: HttpService,
    private readonly snackbarService: SnackbarService
  ) {
  }

  ngOnInit() {
    this.httpService.get('universities/detailed').subscribe((universities: DetailedUniversity[]) => {
      this.universities = universities;
      this.changeDetectorRef.detectChanges();
    })
  }

  adjustAllUniversitiesInList(checkboxEvent: Event) {
    const checkboxValue = checkboxEvent.target as HTMLInputElement
    if (checkboxValue.checked) {
      this.universitiesToModify = this.universities.map((university) => university.id);
      return
    }
    this.universitiesToModify = [];
    this.changeDetectorRef.detectChanges();
  }

  isUniversityAlreadySelected(universityId: string) {
    return this.universitiesToModify.some((_university) => _university === universityId);
  }

  adjustUniversityToModify(universityId: string, checkboxEvent: Event) {
    const checkboxValue = checkboxEvent.target as HTMLInputElement
    if (checkboxValue.checked) {
      this.universitiesToModify.push(universityId);
      return
    }
    const universityIdIndex = this.universitiesToModify.indexOf(universityId)
    if (universityIdIndex === -1) return
    this.universitiesToModify.splice(universityIdIndex, 1)
    this.changeDetectorRef.detectChanges();
  }


  deleteUniversity(universityId: string) {
    this.httpService.delete(`universities/delete/${universityId}`).subscribe({
      next: () => {
        const deletedUniversities = this.universities.find((university) => university.id === universityId)
        if (!deletedUniversities) return;
        const deletedUniversityId = this.universities.indexOf(deletedUniversities)
        this.universities.splice(deletedUniversityId, 1);
        this.handleSuccess()
      },
      error: (e: HttpErrorResponse) => {
        this.handleError(e);
      }
    })
  }

  deleteAllMarkedUniversities() {
    this.httpService.patch(`universities/delete-many`, {universitiesIds: this.universitiesToModify}).subscribe({
      next: () => {
        this.universities = this.universities.filter(university =>
          !this.universitiesToModify.includes(university.id)
        );
        this.handleSuccess()
      },
      error: (e: HttpErrorResponse) => {
        this.handleError(e);
      }
    })
  }

  addUniversity() {
    const dialog = this.dialog.open(AddEditUniversityModalComponent, {width: '500px'})
    dialog.afterClosed().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((results: ModalOutComeWithData) => {
      if (results.result === ModalOutcome.ABANDON) return;
      this.universities.push(results.data);
      this.changeDetectorRef.detectChanges();
    })
  }

  editUniversity(universityId: string) {
    const university = this.universities.find(uni => uni.id === universityId)
    if (!university) return;
    const dialog = this.dialog.open(AddEditUniversityModalComponent, {width: '500px', data: {university: university}})
    dialog.afterClosed().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((results: ModalOutComeWithData) => {
      if (results.result === ModalOutcome.ABANDON) return;
      university.name = results.data.name;
      university.photoId = results.data.photoId;
      university.description = results.data.description;
      this.changeDetectorRef.detectChanges();
    })
  }


  private handleSuccess() {
    let data: SnackbarData = {
      message: 'Operacja przebiegła pomyślnie',
      variant: "info",
      closeButton: true
    }

    this.snackbarService.snackbarFromComponent(SnackbarComponent, data)
    this.changeDetectorRef.detectChanges()
  }

  private handleError(e: HttpErrorResponse) {
    let data: SnackbarData = {
      message: 'Ups! Coś poszło nie tak :(',
      variant: "error",
      closeButton: true
    }

    this.snackbarService.snackbarFromComponent(SnackbarComponent, data)
    this.changeDetectorRef.detectChanges()
  }

}
