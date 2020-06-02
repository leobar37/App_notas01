import { NotifyService } from '../../services/notify.service';

export class renderElements{
  public static deleteCollec:number = 1;
  public static viewNote:number= 2;
    public static renderOptions() : HTMLElement{
        const renderOption= (icon:string, calllback:Function)=>{
           let   a = document.createElement('a');
           let span =  document.createElement('span');  
           a.innerHTML = icon;
           a.addEventListener('click', ()=>calllback());
           span.appendChild(a);
           return   span;
         }  
      let  cont = document.createElement('div');
      cont.classList.add('cont_options');
      let  cont_bas = document.createElement('div');
      cont_bas.classList.add('con_bas');
      let items = [
        { icon :  '<i class="fas fa-trash"></i>' ,
          call : ()=>{
            NotifyService.eventsModal.next(this.deleteCollec)
          }
       },
        { icon :  '<i class="fas fa-sticky-note"></i>' ,
          call : ()=>{
            NotifyService.eventsModal.next(this.viewNote)
          } 
        }
      ] 
     items.forEach(value =>{
         cont_bas.appendChild(renderOption(value.icon , value.call));
     })
    cont.appendChild(cont_bas);
    return cont;
    }

}

