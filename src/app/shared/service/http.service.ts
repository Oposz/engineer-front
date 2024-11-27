import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private readonly httpClient: HttpClient
  ) {
  }

  post(url: string, body: any): Observable<any> {
    return this.httpClient.post(`http://localhost:3000/${url}`, body)
  }

  get(url: string): Observable<any> {
    return this.httpClient.get(`http://localhost:3000/${url}`)
  }

  patch(url: string, body: any): Observable<any> {
    return this.httpClient.patch(`http://localhost:3000/${url}`, body)
  }

  delete(url:string){
    return this.httpClient.delete(`http://localhost:3000/${url}`)
  }

}


