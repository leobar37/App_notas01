import { NotesService } from 'src/app/services/notes.service';

declare var $ :any;

const modal_control = ()=>{
    $('body').on('hidden.bs.modal', '.modal', function () {
         $(this).removeData('bs.modal');
       });
    $('#push_boton').on('click' , ()=>{
      open_modal();
    });
    $('#cerrar_modal').on('click' ,()=>{
       close_modal();
      });
   }
   export const open_modal =()=>{
      let modal = $('#modal_push');
      modal.modal('show');
      modal.show();
   }
   export const close_modal =()=>{
   NotesService.modalControl.next({cmd : 'close'})
    $('#modal_push').hide();
    $('#modal_push').modal('dispose');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').hide();
   let banne =  $('.modal-backdrop');

   if(banne[0]){
      document.body.removeChild(banne[0]);
   }      

}
export const mansoryinit = ()=>{
    let  $grid = $('.grid');
    $grid.masonry({
       itemSelector : '.grid-item',
       columnWidth : 60
      })
      $grid.masonry('layout');
   }
export const refreshMansory =()=>{
   let $grid =  $('.grid');
   $grid.masonry('destroy'); 
   mansoryinit();
   $grid.masonry('reloadItems'); 
}



export const controls_main =()=>{
   setTimeout(() => {
      mansoryinit();
   }, 150);
    modal_control();  
}