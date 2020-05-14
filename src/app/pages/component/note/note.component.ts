import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { Note } from '../../../models/note.model';
import EditorJS from '@editorjs/editorjs';
import CheckList from '@editorjs/checklist';
import List from '@editorjs/list';
import { Ieditor, Ichecklist } from '../../../models/editor.elements';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})

export class NoteComponent implements OnInit {
  @Input() note :Note;
  @ViewChild("cont" , null) elemento:ElementRef;
  elementId : string;
  editor  :EditorJS;
  bandera:boolean = false;
  constructor() { 
  }
  ngOnInit() { 
  
    this.createNote();
  
  }
  
   public async createNote(){
     let caja =  document.createElement('div');
     let data =  this.note.nota;
     let json_data:Ieditor  = JSON.parse(data);
      for (let block of json_data.blocks) {
        switch(block.type){
           case 'checkList':
             let data:Ichecklist =  block.data;
             for (const item of data.items) {
              let check  = this.creteCheck(item.text);
               caja.appendChild(check);
             }
              let el:HTMLElement =  this.elemento.nativeElement;
              el.appendChild(caja); 
           break;
        }
      }
    
   }
   public creteCheck(item:string) {
          let label =  document.createElement('label');
          let input =  document.createElement('input');
          let span =  document.createElement('span');
          span.classList.add('checkmark');
          input.setAttribute('type' , 'checkbox');
          label.classList.add('cont_check');
          label.textContent = item;
          label.appendChild(input);
          label.appendChild(span);  
          return label;
  }
}
