import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {MatDatepickerModule,} from "@angular/material/datepicker";
import {FormControl, FormGroup} from "@angular/forms";
import {DateAdapter, MAT_DATE_LOCALE} from "@angular/material/core";
import {MatInput, MatSuffix} from "@angular/material/input";
import {RouterLink} from "@angular/router";

export enum SortingMode {
  // NONE,
  ASCENDING,
  DESCENDING,
}

@Component({
  selector: 'app-quick-filters',
  standalone: true,
  imports: [
    NgOptimizedImage,
    MatDatepickerModule,
    MatInput,
    MatSuffix,
    RouterLink
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}
  ],
  templateUrl: './quick-filters.component.html',
  styleUrl: './quick-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuickFiltersComponent implements OnInit {

  @Input()
  addButton = true;

  @Input()
  dateRange = true;

  @Input()
  favouritesButton = true;

  @Input()
  newConversationButton = false;

  @Output()
  favToggled: EventEmitter<boolean> = new EventEmitter()

  @Output()
  alphabeticalSortChanged: EventEmitter<SortingMode> = new EventEmitter()

  favourites: boolean = false;
  alphabeticalSortState = SortingMode.ASCENDING

  readonly range = new FormGroup({
    start: new FormControl<Date | null>({value: null, disabled: true}),
    end: new FormControl<Date | null>({value: null, disabled: true}),
  });

  constructor(
    private readonly dateAdapter: DateAdapter<Date>,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.dateAdapter.setLocale('en-GB');
  }

  toggleFavs() {
    this.favourites = !this.favourites
    this.favToggled.emit(this.favourites)
  }

  toggleAlphabeticalSort() {
    switch (this.alphabeticalSortState) {
      case SortingMode.DESCENDING:
        this.alphabeticalSortState = SortingMode.ASCENDING;
        break;
      case SortingMode.ASCENDING:
        this.alphabeticalSortState = SortingMode.DESCENDING;
        break;
    }
    this.alphabeticalSortChanged.emit(this.alphabeticalSortState)
    this.changeDetectorRef.detectChanges();
  }

  protected readonly SortingMode = SortingMode;
}
