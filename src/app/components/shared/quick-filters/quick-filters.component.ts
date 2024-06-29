import {Component, Input, OnInit} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {MatDatepickerModule,} from "@angular/material/datepicker";
import {FormControl, FormGroup} from "@angular/forms";
import {DateAdapter, MAT_DATE_LOCALE} from "@angular/material/core";
import {MatInput, MatSuffix} from "@angular/material/input";
import {RouterLink} from "@angular/router";

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
  styleUrl: './quick-filters.component.scss'
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


  readonly range = new FormGroup({
    start: new FormControl<Date | null>({value: null, disabled: true}),
    end: new FormControl<Date | null>({value: null, disabled: true}),
  });

  constructor(
    private readonly dateAdapter: DateAdapter<Date>
  ) {
  }

  ngOnInit() {
    this.dateAdapter.setLocale('en-GB');
  }
}
