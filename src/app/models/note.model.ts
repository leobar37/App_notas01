import {OutputData} from '@editorjs/editorjs';

export class Note{
   public nombre:string;
   public nota:string;
   public collec:number;
   public id_note?:string; 
   constructor (nombre:string, nota:string, collec:number, id_note?:string){
     this.nombre = nombre;
     this.nota = nota;
     this.collec =  collec;
     this.id_note =  id_note;
   } 
    
   public static acomodarData(data:Inote[]){
      let retorno:Note[] = [];
      for (const inote of data) {
         let note = new Note(inote.name_note, inote.note, inote.id_collection , inote.id_note);
         retorno.push(note);
      }
      return retorno;
   }
   public static transformarNota(data:Iresp) :Inote {
   let auxData = data.nota;    
   return auxData[0];
 }
}
export interface Inote{
id_note:string,
name_note:string,
note:string,
creation?:string,
id_collection?:number
}
export interface Iresp{
  ok :boolean,
  nota:Inote[]
}