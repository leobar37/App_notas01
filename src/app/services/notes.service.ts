import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Note } from '../models/note.model';
import { EventEmitter } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class NotesService {
  public static modalControl = new EventEmitter();
  constructor(
     private http:HttpClient
  ) 
  {}
   agregarNota(note:Note){
     let url = environment.url_backend  + 'note';
     return this.http.post(url ,note);
   }
   obtenerNotas(){
    let url = environment.url_backend  + 'note';
    return this.http.get(url);
  }
  obtenerNota(idNote){
    let url = environment.url_backend  + 'note/'+idNote;
    return this.http.get(url);
   }
}
