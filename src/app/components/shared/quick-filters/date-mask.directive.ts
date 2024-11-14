import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[appDateMask]',
  standalone: true
})
export class DateMaskDirective {

  constructor(
    private el: ElementRef
  ) {}

  @HostListener('input', ['$event'])
  onInput(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');


    if (value.length > 8) {
      value = value.substr(0, 8);
    }

    if (value.length >= 2) {
      value = value.substr(0, 2) + (value.length > 2 ? '/' : '') + value.substr(2);
    }
    if (value.length >= 5) {
      value = value.substr(0, 5) + (value.length > 5 ? '/' : '') + value.substr(5);
    }

    if (value.length === 10) {
      const day = parseInt(value.substr(0, 2));
      const month = parseInt(value.substr(3, 2));
      const year = parseInt(value.substr(6, 4));

      if (day > 31 || month > 12) {
        value = '';
      }
    }

    input.value = value;
  }

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    const pattern = /[0-9\-]/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
