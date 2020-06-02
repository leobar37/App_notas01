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
    public static deleteNote(lista_notas:Note[], idnote:string){
    return lista_notas.filter(note =>{
            return  note.id_note  != idnote; 
        })
    }
    public static searchNote (lista_notas:Note[] ,idNote:string):Note{
        return lista_notas.filter( note =>{
            return  note.id_note =  idNote;
         })[0];
    }
    public static updateNote(lista_notas:Note[] , idNote:string , newNote:Note ){
       const updata = (note:Note)=>{
          if(note.id_note == idNote){
              note = newNote;
          }
          return note;
       }
       return lista_notas.map(updata);
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