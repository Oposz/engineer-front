import {ChangeDetectorRef, Component, inject, Input, OnInit} from '@angular/core';
import {HttpService} from "../../../shared/service/http.service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-photo',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './photo.component.html',
  styleUrl: './photo.component.scss'
})
export class PhotoComponent implements OnInit {
  @Input({required: true})
  photoId!: string

  @Input()
  cssClasses: string[] | string= []

  httpService = inject(HttpService)
  domSanitizer = inject(DomSanitizer)

  safeImageUrl: SafeUrl = ''

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    console.log('hao')
    this.httpService.get(`upload/${this.photoId}`).subscribe((base64: { data: string }) => {
      this.safeImageUrl = this.domSanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + base64.data)
      this.changeDetectorRef.detectChanges();
    })
  }
}
