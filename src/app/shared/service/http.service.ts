import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private readonly httpClient: HttpClient
  ) {
  }

  post(url: string, body: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}${url}`, body)
  }

  get(url: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}${url}`)
  }

  patch(url: string, body: any): Observable<any> {
    return this.httpClient.patch(`${environment.apiUrl}${url}`, body)
  }

  delete(url:string){
    return this.httpClient.delete(`${environment.apiUrl}${url}`)
  }

}


