import { Component, OnInit, Renderer2, EventEmitter, OnDestroy } from '@angular/core';
import { NotifyService } from '../../services/notify.service';
import { Collection } from 'src/app/models/collec.model';
import { CollecService } from '../../services/collec.service';
import { Subscription, Observable } from 'rxjs';
import { collecConst } from '../../globals/keywords';
import { renderElements } from './collect.element';
import { cargarEstilo } from '../../scripts/dependecias';
import { Router } from '@angular/router';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss']
})
export class CollectionsComponent implements OnInit , OnDestroy {
  private form:HTMLElement;
  private nombreCollec:string = null;
  private descriptionCollec:string =  null;
  private idCollection:string = null;
  private ctrlEventCollec:EventEmitter<number>=new EventEmitter();
  private suscribe:Subscription;

  public list_collections:Collection[] = [];
  constructor(
    private _alert:NotifyService,
    private  _re :Renderer2,
    private _collec: CollecService,
    private router:Router
  ) { 
    this.ctrlCollection();
  }
 
 
  ngOnInit() {
    this.form = this.createElementInput();
     (async ()=>{
      await this._alert.iniNotify();
      this.ctrlEventCollec.next(collecConst.getCollec);
      await cargarEstilo('assets/css/options.css','');
   
      })().then(res => console.log('success notify')
      )
  }
  ngOnDestroy(){
  this.suscribe.unsubscribe();
  }
  private async instance_modal(editar?:boolean):Promise<boolean>{
    let text = 'guardar';
    if(editar){
      text  = 'editar';
    }
    
    let result:boolean=await this._alert.confirm( this.createElementInput(),
      [null ,null] , [text, 'descartar']);
      //  this._re.destroyNode( this.form);     
    return result;
  }
  // * evento : abrir colleccion
  public async openCollec(idCollec: string){
      this.idCollection = idCollec;   
      this.ctrlEventCollec.next(collecConst.opecCollec);
  }
 // * evento: crear colleccion
  public async createCollect(){
        this.ctrlEventCollec.next(collecConst.createCollec);
  }


  //** end helpers */
 
  private ctrlCollection():void{
    //* crear collec
    let collect = new Collection();
    //*  eventos de la colleccion
 this.suscribe = this.ctrlEventCollec.subscribe(async (cmd: number) =>{
        //* crear colleccion     
      if(cmd == collecConst.createCollec){
        this.llenarCampos(null);
        let result =  await this.instance_modal();
        if(result){
          let  campos_c = this.comprobarCampos();
         if(!campos_c){
           this._alert.messageBotton('Existen campos vacios' , this._alert.error);
            return;
          }
          let collec = new Collection();
          collec.$name = this.nombreCollec;
          collec.$description =  this.descriptionCollec;
          collec.$id_user = 'one_w';   
            this._collec.createPost(collec).subscribe( (data : { ok : boolean , id_collection:  number , creation : string })=>{
       
              if(data.ok == true){
                collec.$id_collection = this.idCollection;
                collec.$creation = Collection.transformDate(data.creation);
                this.list_collections.unshift(collec);
                this._alert.messageBotton('guardado', this._alert.succes);
              }else{
                this._alert.error_process();
              }
              this.llenarCampos(null);
           });
           //vaciar campos
          }
        }
        //* editar collecion *//
      if(cmd == collecConst.editCollec){
        let  campos_c = this.comprobarCampos();
        if(campos_c == false){
          await this._alert.messageBotton('Existen campos vacios' , this._alert.error);
          this.llenarCampos(null);
          return;
          }
          //** sigue teniendo referencia */
          collect.$name = this.nombreCollec;
          collect.$description =  this.descriptionCollec;
          collect.$id_user = 'one_w';   
        
          this._collec.editCollec(collect).subscribe( (data : { ok : boolean})=>{
            if(data){
              this._alert.messageBotton('editado', this._alert.succes);
            
            }else{
              this._alert.error_process();
           }
          this.llenarCampos(null);
          });
      }
      //* traer todas las colleciones */
      if(cmd == collecConst.getCollec ){
        this._collec.getCollec().subscribe( async(data : { ok : boolean, rpta:any[]}) =>{
          if(data.ok){
              this.list_collections = await  Collection.acomodarData(data.rpta);
              
            }
          })  
        }
      // * abrir collecciones
      if(cmd == collecConst.opecCollec){
          collect = await Collection.serachCollec(this.idCollection, this.list_collections)[0];
          this.llenarCampos(collect);
          let  result = await this.instance_modal(true);    
          if(result) this.ctrlEventCollec.next(collecConst.editCollec);
      }
    })
    // * eventos de parte del servicio del modal
    NotifyService.eventsModal.subscribe(async (cms: number)=>{
      if(cms == this._alert.close_modal){
        this.llenarCampos(null);
      }
       // * modal : eliminar colleccion
      if(cms == renderElements.deleteCollec){
         if(this.idCollection != null){    
            this._collec.deleteCollec(this.idCollection).subscribe((data : {ok : boolean , rpta?: any , error?:string})=>{
                if(data.ok == true){
                  this.list_collections = Collection.deleteCollect(data.rpta[0].id_collection , this.list_collections);
                  NotifyService.eventsModal.next(this._alert.close_modal);
                  this._alert.messageBotton('collecion eliminada' , this._alert.succes);
                }
            })
         }
      }
      //* modal : abrir las notas */
      if(cms = renderElements.viewNote){
        if(this.idCollection != null){
          await  this.router.navigate(['notes' , this.idCollection]);
          this._alert.cerrarConfirm();
          
        }
      
      }
   })
}

  private createElementInput():HTMLElement{
    let conte :HTMLElement =  this._re.createElement('div');
     conte.style.height = '30vh';   
     conte.style.width = '100%';
    let h1:HTMLHtmlElement  = this._re.createElement('h1');       
    h1.textContent = "Registrar colleccion";
    h1.style.fontSize ='1.2rem';
    h1.style.width = '180px';
    h1.classList.add('mx-auto' , 'pb-2');
    let input_nombre :HTMLInputElement  =  this._re.createElement('input');
    input_nombre.addEventListener('change' , (event:any)=>{       
      this.nombreCollec = event.target.value;
    });
    input_nombre.classList.add('form-control');
    input_nombre.style.marginBottom = '0.8rem';
    input_nombre.setAttribute('placeholder' , 'titulo');
    
    let input_descripcion :HTMLInputElement  =  this._re.createElement('textarea');
    
    input_descripcion.classList.add('form-control' , 'mb-2');
    input_descripcion.setAttribute('placeholder' , 'descripcion');
    input_descripcion.addEventListener('change' , (event :any) =>{
      // console.log('values' , event.target.value);
      this.descriptionCollec = event.target.value;
   })
   if(this.nombreCollec != null && this.descriptionCollec  != null){
     input_nombre.value = this.nombreCollec;
     input_descripcion.textContent = this.descriptionCollec;
   }
     
    this._re.appendChild(conte, h1);
    this._re.appendChild(conte, input_nombre);
    this._re.appendChild(conte, input_descripcion); 
    this._re.appendChild(conte, renderElements.renderOptions()); 
    return conte;
  }
  //* helpers 
  private comprobarCampos() : boolean{
    if(this.nombreCollec == null || this.nombreCollec.trim().length == 0){
      return false;
     }
     if(this.descriptionCollec == null || this.descriptionCollec.trim().length == 0){
     return false;
    }
   return true;
 }
 private llenarCampos(collect : Collection){
   if(collect ==  null){
     this.nombreCollec = null;
     this.descriptionCollec = null;
     this.idCollection = null;
   }else{
     this.nombreCollec =  collect.$name;
     this.descriptionCollec = collect.$description;   
   }
 } 



}
