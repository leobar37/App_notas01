import CheckList from '@editorjs/checklist';
import List from '@editorjs/list';

let  configEditos =  { 
    holderId :  null,
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
      }
export const config_editor = (nameId:string) =>{
     configEditos.holderId =  nameId;
     return  configEditos;
} 