import { Component, OnInit, Renderer2, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { controls_main, close_modal, mansoryinit, refreshMansory, open_modal } from './notes.elements';
import { NgForm } from '@angular/forms';
import { Note, Inote } from '../../models/note.model';
import { NotesService } from '../../services/notes.service';
import { cargarScripts, cargarScript, cargarEstilos } from '../../scripts/dependecias';

declare var alertify:any;
/*=============================================
=            modulos externos            =
=============================================*/
import EditorJS, { LogLevels } from '@editorjs/editorjs';
import CheckList from '@editorjs/checklist';
import LinkTool from '@editorjs/link';
import List from '@editorjs/list';
import   Header  from '@editorjs/header';
// import Code from '@editorjs/code';
import CodeList from '../../../assets/js/app.bundle';
import { EventEmitter } from '@angular/core';
import { NotifyService } from 'src/app/services/notify.service';
import { TimeagoService } from '../../services/timeago.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit , OnDestroy{
   @ViewChild('nombreInput' , null) $titulo_element :ElementRef;
   private  LOAD_NOT:number = 1; private resp_note:number = 0;private RENDER_NOTE = 2;private clearEditor :number= 3;
   private  CAMBIO_NOTA:Number =4 ; private ELIMINAR_NOTA = 5 ;
   public nombre :string = "";
   public nota :string = ""; 
   public time_creation :string  ="";
   public lista_notas:Note[] = [];
   private idCollection:string;
   private emit_note = new EventEmitter();
   private subRouter:Subscription;
   private idNota_open : string = null;
  constructor(
    private _notes:NotesService,
    private  _noti:NotifyService,
    private _TimeAgo:TimeagoService,
    private activeRoute :ActivatedRoute
  ) {   
   console.log('cargo el dom');
    this.subRouter = this.activeRoute.params.subscribe( params =>{
      this.idCollection = params['id'];
      this.llenarNotas();
  })
  }
  ngOnInit() {
    this.editor_js_controls().then( async ()=>{
      controls_main();
     await  this._noti.iniNotify();
       this.llenarNotas();   
       this.control_Nota();   
    }) 
  }
  ngOnDestroy(){
    this.subRouter.unsubscribe();
  }
  public control_Nota(){        
    this.emit_note.subscribe((cmd: { res : number})=>{
    
      // let note :Note =  new Note()
      // * cuando guardar los cambios
      if(cmd.res == this.CAMBIO_NOTA){
        // ? si la nota esta vacia no guarda los cambios
        if(this.nota.length == 0){
          return;
        }
        let evalNote =  JSON.parse(this.nota);    
        if(this.idNota_open !=  null){
          //editar nota
          if(evalNote.blocks.length  == 0){
            return;
          }
          let note = new Note(this.nombre, this.nota, Number(this.idCollection), this.idNota_open);
          this._notes.editarNota(note).subscribe(async (res)=>{
            // ?  falta notificar si se recibe un error desde el servidor
                note.id_note = this.idNota_open;
               this.lista_notas = await Note.updateNote(this.lista_notas , this.idNota_open , note);
               await refresh();
            });
            }else{
              // * si no hay nota no guarda
              if(evalNote.blocks.length  != 0){
                // *si el nombre de la nota no existe buscamos un header de la nota 
                 if(this.nombre.trim().length  == 0 ){
                     this.nombre = 'no name'
                 }    
                // ? cuando no existe un id guarda la nota
                let note = new Note(this.nombre, this.nota, Number(this.idCollection));
                this._notes.agregarNota(note).subscribe(async(response: { ok:boolean , rpta:any })=>{
                  if(response.ok){
                   this.idNota_open = response.rpta[0].id_note;
                  note.id_note = this.idNota_open;
                   this.lista_notas.push(note);
                }
              });
              }//end if             
            }
          }
          if(cmd.res == this.ELIMINAR_NOTA){
        
            this._notes.eliminarNota(this.idNota_open).subscribe( (data : { ok: boolean, id_note:string}) =>{
             this.lista_notas =  Note.deleteNote(this.lista_notas ,  data.id_note);
              close_modal();   
            });
          }

          const  refresh =async ()=>{
            // await this.llenarNotas();
            setTimeout(() => {
              refreshMansory();
            }, 5);
          }
      });
 
  }
  private llenarNotas(){
    this._notes.obtenerNotas(this.idCollection).subscribe(async(notas : { resp :boolean , notas :Inote[]})=>{
       this.lista_notas = await Note.acomodarData(notas.notas);  
    })
  }
 
  private async editor_js_controls(){
      // * routes dependeces
      let  libs : string[]= [ 
        "assets/libs/mansory/mansory.js" 
      ]
     const EditorJsInstance  = async ()=>{
     let  editor = new EditorJS({
      //  holderId : 'editorjs',
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
        header: {
          class: Header,
          shortcut: 'CMD+SHIFT+H',
        }, 
        linkTool: {
          class: LinkTool,
          config: {
            endpoint: 'http://localhost:4200/fetchUrl', // Your backend endpoint for url data fetching
          }
        },
         code: CodeList
       },
       onChange :()=>{
            this.emit_note.next({res: this.LOAD_NOT});      
      }
     });
     // * Ecuchar evento que tengan que ver con el editor
      this.emit_note.subscribe( (cmd : { res: number, id?:string})=>{
        // * cuando cargar la nota
        if(cmd.res == this.LOAD_NOT){
          editor.save().then( (data)=>{
            this.nota =  JSON.stringify(data);
             this.emit_note.next({ res :  this.CAMBIO_NOTA});
           });
        }
        // * caundo renderizar la nota
        if(cmd.res == this.RENDER_NOTE){
          this._notes.obtenerNota(cmd.id).subscribe((data:any)=>{

           let Data=  Note.transformarNota(data);
           this.nombre=  Data.name_note;
           this.time_creation = this._TimeAgo._format(new Date(Data.creation));
           if(Data.note !== ""|| Data.note){
             let jsonData = JSON.parse(Data.note);   
             editor.render(jsonData);
           }
           open_modal();
          });
        }
        // * cuando limpiar el editor
        if(cmd.res == this.clearEditor){
           editor.clear();
        }
     });
      }
      // * evento para refrescar los items
      const  refresh =async ()=>{
        // await this.llenarNotas();
        setTimeout(() => {
          refreshMansory();
        }, 100);
      }
      // * escucha del evento del modal
      NotesService.modalControl.subscribe( async (reso: { cmd :string})=>{
           if(reso.cmd == 'close'){
             if(this.nombre)
             this.nombre = "";
             this.nota = "";
             this.time_creation  = "";
              this.idNota_open = null;
              // ? necesario borrar el id cuando la nota se cierre
              this._noti.messageBotton('se han guardado los cambios' , this._noti.succes);
             await refresh();
             this.emit_note.next({ res : this.clearEditor})      
           }
      });
      //* Evento de cambio del titulo 
      (<HTMLInputElement>this.$titulo_element.nativeElement).addEventListener('change' , ()=>{
        //  console.log('notifica el titulo');
         this.nombre =  this.$titulo_element.nativeElement.value.trim();
        this.emit_note.next({ res : this.CAMBIO_NOTA})
      });
    //* run scripts
     await cargarScripts(libs , 'note');
      EditorJsInstance();
  }

   public open_nota(idNote:string){
    this.idNota_open =  idNote;
   this.emit_note.next({res: this.RENDER_NOTE, id : idNote});
  } 
  public eliminarNota(){
     if(this.idNota_open != null){
       let div = document.createElement('div');
       let h1 =  document.createElement('h2');
       let p =  document.createElement('p');
        p.style.textAlign = 'center';
       p.style.paddingTop = '10px';
        h1.textContent = "¿Desea eliminar esta nota?";
        p.textContent  ="Esta accion es irreversible";
        div.appendChild(h1);
        div.appendChild(p);
       this._noti.confirm( div, 
          ['nota eliminada' , 'descartado'] , ['eliminar' , 'no'])
          .then((res : boolean) =>{
              if(res){
                this.emit_note.next({res : this.ELIMINAR_NOTA});
                close_modal();
              }else{
                console.log('la nota no se ha eliminado');
              }
          });
     }
  }

}

