import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {MatDatepickerModule,} from "@angular/material/datepicker";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {DateAdapter, MAT_DATE_LOCALE} from "@angular/material/core";
import {MatInput, MatSuffix} from "@angular/material/input";
import {RouterLink} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {debounceTime} from "rxjs";

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
    RouterLink,
    ReactiveFormsModule
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

  @Output()
  searchbarValueChanged: EventEmitter<string> = new EventEmitter()

  favourites: boolean = false;
  alphabeticalSortState = SortingMode.ASCENDING
  destroyRef: DestroyRef = inject(DestroyRef);

  readonly range = new FormGroup({
    start: new FormControl<Date | null>({value: null, disabled: true}),
    end: new FormControl<Date | null>({value: null, disabled: true}),
  });

  searchbarControl: FormControl<string> = new FormControl('', {nonNullable: true});

  constructor(
    private readonly dateAdapter: DateAdapter<Date>,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.dateAdapter.setLocale('en-GB');
    this.observeSearchbarValue();
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

  private observeSearchbarValue(){
    this.searchbarControl.valueChanges.pipe(
      debounceTime(500),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((searchValue)=>{
      this.searchbarValueChanged.emit(searchValue)
    })
  }

  protected readonly SortingMode = SortingMode;
}
