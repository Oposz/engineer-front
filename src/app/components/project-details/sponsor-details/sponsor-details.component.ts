import {ChangeDetectorRef, Component, inject, Input, OnInit} from '@angular/core';
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {JsonPipe} from "@angular/common";
import {MatTooltip} from "@angular/material/tooltip";
import {LoaderComponent} from "../../shared/loader/loader.component";
import {Sponsor} from "../../../shared/constants/project";
import {HttpService} from "../../../shared/service/http.service";

@Component({
  selector: 'app-sponsor-details',
  standalone: true,
  imports: [
    JsonPipe,
    MatTooltip,
    LoaderComponent
  ],
  templateUrl: './sponsor-details.component.html',
  styleUrl: './sponsor-details.component.scss'
})
export class SponsorDetailsComponent implements OnInit {

  @Input({required: true})
  sponsor!: Sponsor

  httpService = inject(HttpService)
  domSanitizer = inject(DomSanitizer)

  safeImageUrl: SafeUrl = ''

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.httpService.get(`upload/${this.sponsor.photoId}`).subscribe((base64: { data: string }) => {
      this.safeImageUrl = this.domSanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + base64.data)
      this.changeDetectorRef.detectChanges();
    })
  }
}
