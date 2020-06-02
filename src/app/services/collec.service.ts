import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Collection } from '../models/collec.model';

@Injectable({
  providedIn: 'root'
})
export class CollecService {

  constructor(
    private http:HttpClient
  )
   { }
  
   public createPost(collec: Collection){
     let url = environment.url_backend + 'collec';
     return this.http.post(url, collec);
    } 
    public getCollec(){
       let url = environment.url_backend + 'collec';
       return this.http.get(url);
   }
    public editCollec(collec:Collection){
      let url = environment.url_backend + 'collec/'+ collec.$id_collection;
      return this.http.put(url , collec);
    }
    public deleteCollec(idCollec:string){
      let url = environment.url_backend + 'collec/'+ idCollec;
      return this.http.delete(url);
    }
}
