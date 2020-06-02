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
   public agregarNota(note:Note){
     let url = environment.url_backend  + 'note';
     return this.http.post(url ,note);
   }
   public obtenerNotas(idCollec:string){
    let url = environment.url_backend  + 'notes/' + idCollec;
    return this.http.get(url);
  }
  public obtenerNota(idNote: string){
    let url = environment.url_backend  + 'note/'+idNote;
    return this.http.get(url);
  }
  public editarNota(note:Note){
    let url = environment.url_backend  + 'note/'+note.id_note;
    return this.http.put(url,note);
  }
  public eliminarNota(idNote:string){
    let url = environment.url_backend  + 'note/' + idNote;
    return this.http.delete(url);
  }
}
