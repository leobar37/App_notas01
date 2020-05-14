import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { controls_main, close_modal, mansoryinit, refreshMansory, open_modal } from './notes.elements';
import { NgForm } from '@angular/forms';
import { Note, Inote } from '../../models/note.model';
import { NotesService } from '../../services/notes.service';
import { cargarScripts } from '../../scripts/dependecias';

/*=============================================
=            modulos externos            =
=============================================*/
import EditorJS from '@editorjs/editorjs';
import CheckList from '@editorjs/checklist';
import List from '@editorjs/list';
import { EventEmitter } from '@angular/core';
@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  private  LOAD_NOT:number = 1; private resp_note:number = 0;private RENDER_NOTE = 2;private clearEditor :number= 3;
   public nombre :string = "";
   public nota :string = ""; 
   public lista_notas:Note[] = [];
   private emit_note = new EventEmitter();
  constructor(
    private _notes:NotesService,
    private  render:Renderer2
  ) {   
    
  }

  ngOnInit() {
    this.runDependencias().then(()=>{
      controls_main();
       this.llenarNotas();   
   
    })
          //instancias editor js
  }
   public guardarNota(form:NgForm){
     if(form.invalid){
         return;
      }
      //verficar que hay escrito mas de 10 caracateres
      this.emit_note.emit({ res : this.LOAD_NOT});
      this.emit_note.subscribe((cmd: { res : number})=>{
        if(cmd.res  ==  this.resp_note){
          let note = new Note(this.nombre, this.nota,1);
          this._notes.agregarNota(note).subscribe(async(response: { ok:boolean , rpta:any })=>{
            if(response.ok){
            await this.llenarNotas();
    
            setTimeout(() => {
              refreshMansory();
            }, 400);
          }
        });
       }
      });
  }
  private llenarNotas(){
    this._notes.obtenerNotas().subscribe(async(notas : { resp :boolean , notas :Inote[]})=>{
       this.lista_notas = await Note.acomodarData(notas.notas);  
    })
  }
 
  private async runDependencias(){
      let  libs : string[]= [ 
        "assets/libs/mansory/mansory.js" 
      ]
     const EditorJsInstance  = async ()=>{
     let  editor = new EditorJS({
       holderId : 'editorjs',
       autofocus : true,
       tools : {
        checkList : {
          class:CheckList,
          inlineToolbar: true,
        },
        list: {
          class: List,
          inlineToolbar: true,
        },
       }
     });
     //Ecuchar evento que tengan que ver con el editor
      this.emit_note.subscribe( (cmd : { res: number, id?:string})=>{
        if(cmd.res == this.LOAD_NOT){
          editor.save().then( (data)=>{
            this.nota =  JSON.stringify(data),
             this.emit_note.next({ res :  this.resp_note});
           });
        }
        if(cmd.res == this.RENDER_NOTE){
          this._notes.obtenerNota(cmd.id).subscribe((data:any)=>{
           let Data=  Note.transformarNota(data);
           this.nombre=  Data.name_note;
           let jsonData = JSON.parse(Data.note);   
           editor.render(jsonData);
          //  open_modal();
          });
        }
        if(cmd.res == this.clearEditor){
           editor.clear();
        }
     });
      }
      //escucha del evento del modal
      NotesService.modalControl.subscribe((reso: { cmd :string})=>{
           if(reso.cmd == 'close'){
             this.nombre = "";
             this.emit_note.next({ res : this.clearEditor})      
           }
      });

     await cargarScripts(libs , 'note');
      EditorJsInstance();
  }
  public open_nota(idNote:string){
   this.emit_note.next({res: this.RENDER_NOTE, id : idNote})
  } 


}

