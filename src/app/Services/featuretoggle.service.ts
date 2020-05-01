import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeaturetoggleService {

private _autoRefreshFromDb = new Subject<boolean>();
public autoRefreshMessage$ = this._autoRefreshFromDb.asObservable();

  constructor() { }

  sendmessage(feature:boolean){
    this._autoRefreshFromDb.next(feature);
  }

}
