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


export let collecConst = {
editCollec : 1,
createCollec : 2,
getCollec : 3,
opecCollec : 4,
chageCollec : 5,
deleteCollec : 6
}