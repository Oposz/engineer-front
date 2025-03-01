import {Injectable} from '@angular/core';
import {HttpService} from "./http.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  constructor(private httpService: HttpService) {}

  uploadFile$(file: File): Observable<any> {
    const formData = new FormData();
    formData.set('file', file);
    return this.httpService.post('upload', formData);
  }
}

