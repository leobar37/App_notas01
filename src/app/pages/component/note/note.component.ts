import { Component, OnInit, Input, ElementRef, ViewChild, Renderer2, EventEmitter, OnDestroy } from '@angular/core';
import { Note } from '../../../models/note.model';
import EditorJS from '@editorjs/editorjs';
import CheckList from '@editorjs/checklist';
import List from '@editorjs/list';
import { Ieditor, Ichecklist, Ilist } from '../../../models/editor.elements';
import { cargarEstilo } from '../../../scripts/dependecias';


@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})

export class NoteComponent implements OnInit,OnDestroy {
  @Input() note :Note;
  @ViewChild("cont" , null) elemento:ElementRef;
  elementId : string;
  editor  :EditorJS;
  bandera:boolean = false;
  
  private bloques:any;

  constructor(
    private render:Renderer2,
  
  ) {     

  }
  ngOnInit() { 
      this.dependeces().then(()=>{
         this.createNote();
      })


  }
  ngOnDestroy(){
  
    
  }

   public async createNote(){
     let caja =  document.createElement('div');
     let data =  this.note.nota;
    if(data == "" ||  !data){
      return;
     }
     let json_data:Ieditor  = JSON.parse(data);
     let el:HTMLElement =  this.elemento.nativeElement;
     this.bloques =  json_data.blocks;
      for (let block of this.bloques) {
        switch(block.type){
           case 'checkList':
             let data:Ichecklist =  block.data;
             for (const item of data.items) {
              let check  = this.creteCheck(item.text , item.checked);
               await this.render.appendChild(caja, check);
             }
              this.render.appendChild(el, caja);
           break;
           case 'list':
             let list:Ilist = block.data;   
             let lista =  this.createlist(list);
            await this.render.appendChild(el, lista);
           break;
           case 'paragraph':
            await this.render.appendChild(el , this.createText(block.data.text));  
           break;

        }
      }
   }
   public creteCheck(item:string , check: boolean) {
          let label =  document.createElement('label');
          let input =  document.createElement('input');
          let span =  document.createElement('span');
          input.checked = check;
          input.disabled = true;
          this.render.addClass(span, 'checkmark');
          input.setAttribute('type' , 'checkbox');
           this.render.addClass(label , 'cont_check');
          label.innerHTML = item;
          label.appendChild(input);
          label.appendChild(span);  
          return label;
  }
  public createlist(lista:Ilist){
    let lu =  document.createElement('ul');
   if(lista.style=='ordered'){
       lu.style.listStyle ='decimal';
    }else{
      lu.style.listStyle ='circle';
   }
   for (const item of lista.items) {
     let li = document.createElement('li'); 
     li.innerHTML = item;
      lu.appendChild(li); 
   }
   return lu;
  } 
  public createText(texto:string){
  let p = document.createElement('p');
  p.innerHTML =  texto;
 return p
 }
  private async dependeces(){
     await  cargarEstilo('assets/css/editor.css' , 'note');
  }
}
