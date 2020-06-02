import { Injectable, EventEmitter } from '@angular/core';
import { cargarEstilos, cargarScript } from '../scripts/dependecias';
declare var alertify:any;
@Injectable({
  providedIn: 'root'
})
export class NotifyService {
  public  error:number = 1;
  public succes: number =2;
  public close_modal: number = 3;
  public static  eventsModal:EventEmitter<number> = new EventEmitter();
  constructor() {

  }
   private cofigurationAlert(){
    alertify.defaults = {
      // dialogs defaults
      autoReset:true,
      basic:false,
      closable:true,
      closableByDimmer:true,
      invokeOnCloseOff:false,
      frameless:false,
      defaultFocusOff:false,
      maintainFocus:true, // <== global default not per instance, applies to all dialogs
      maximizable:true,
      modal:true,
      movable:true,
      moveBounded:false,
      overflow:true,
      padding: true,
      pinnable:true,
      pinned:true,
      preventBodyShift:false, // <== global default not per instance, applies to all dialogs
      resizable:true,
      startMaximized:false,
      transition:'pulse',
      transitionOff:false,
      tabbable:'button:not(:disabled):not(.ajs-reset),[href]:not(:disabled):not(.ajs-reset),input:not(:disabled):not(.ajs-reset),select:not(:disabled):not(.ajs-reset),textarea:not(:disabled):not(.ajs-reset),[tabindex]:not([tabindex^="-"]):not(:disabled):not(.ajs-reset)',  // <== global default not per instance, applies to all dialogs
      // notifier defaults
      notifier:{
      // auto-dismiss wait time (in seconds)  
          delay:5,
      // default position
          position:'bottom-right',
      // adds a close button to notifier messages
          closeButton: false,
      // provides the ability to rename notifier classes
          classes : {
              base: 'alertify-notifier',
              prefix:'ajs-',
              message: 'ajs-message',
              top: 'ajs-top',
              right: 'ajs-right',
              bottom: 'ajs-bottom',
              left: 'ajs-left',
              center: 'ajs-center',
              visible: 'ajs-visible',
              hidden: 'ajs-hidden',
              close: 'ajs-close'
          }
      },

      // language resources 
      glossary:{
          // dialogs default title
          title:'NotesAPP',
          // ok button text
          ok: 'OK',
          // cancel button text
          cancel: 'Cancel'            
      },

      // theme settings
      theme:{
          // class name attached to prompt dialog input textbox.
          input:'ajs-input',
          // class name attached to ok button
          ok:'ajs-ok',
          // class name attached to cancel button 
          cancel:'ajs-cancel'
      },
      // global hooks
      hooks:{
          // invoked before initializing any dialog
          preinit:function(instance){
      
          },
          // invoked after initializing any dialog
          postinit:function(instance){},
      },
  };
   }
   private async  notify_js_controls(){
    await cargarScript("assets/js/alertifyjs/alertify.min.js" , 'notify')
    await cargarEstilos( [ "assets/js/alertifyjs/css/alertify.min.css" ,"assets/js/alertifyjs/css/themes/default.min.css"] , 'notify');
  }
   public async iniNotify(){
   await this.notify_js_controls();
   this.cofigurationAlert(); 
   }
  public  cerrarConfirm(){
     alertify.confirm().close();
  }

   /*  
      * methods alertify 
   */
    public confirm(text: string | HTMLElement, results:string[] , labels:string[]):Promise<boolean>{      
      return new Promise((resolve, reject)=>{
        alertify.confirm( text, ()=>{
          if(results[0] != null)
          alertify.success(results[0]);
          resolve(true);
          }, ()=>{
          if(results[1] != null)
          alertify.error(results[1]);
          resolve(false)
          }).set({labels :  { ok : labels[0] , cancel : labels[1]}, padding : true ,onclose : ()=>{
  
          }})  
      })
  }
   public messageBotton(message:string , option:number){
     switch(option){
        case  this.error : {
          alertify.error(message);
        }
        break;
        case  this.succes : {
          alertify.success(message);
        }
     }
   }
   public error_process(message?:string){  

   let contIcon = document.createElement('div');
   let h1 = document.createElement('h1');
   h1.textContent = 'message error';
   h1.style.textAlign ='center';
   let icon =  document.createElement('i');
   icon.style.paddingLeft = '45%';
   icon.style.color ='red';
   icon.classList.add('fas' ,'fa-times');
   icon.style.fontSize= '50px';
   icon.style.paddingBottom ='1rem';
   contIcon.appendChild(h1);
   contIcon.appendChild(icon);
   let p = document.createElement('p');
   p.textContent = 'Error de sistema por favor revise su conexión o intentelo mas tarde';
   contIcon.appendChild(p);
  // alertify.minimalDialog( contIcon);
   alertify.alert('NotesApp', contIcon);
}

}
