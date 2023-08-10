
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable} from 'rxjs';
import { BeforeCatImage} from '../interface/cat';
@Injectable({
  providedIn: 'root'
})
export class CatService {
  cat:Observable<BeforeCatImage[]> = inject(HttpClient).get<BeforeCatImage[]>("https://api.thecatapi.com/v1/breeds",{
    headers: new HttpHeaders({
      "x-api-key":"live_ygu2V2dHuG5Q4qPRx22Ukr2kAl9AJMdWu9LCGCrtlkJW4ApQPYrYgjfAx911Kyph"
    })
  })

  constructor(private https:HttpClient) { }

  inputObservble:Observable<any> = new Observable;

  giveObservble(elem:Observable<any> ){
  this.inputObservble = elem;
  }

  takeObservble(){
    return this.inputObservble;
  }



}
