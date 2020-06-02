import { format, render, cancel, register } from 'timeago.js';
export class Collection{
    private id_collection:string;
    private name:string;
    private description:string;
    private id_user:string;
    private creation:string;
   constructor(){
   }
   public static acomodarData(data:any[]): Promise<Collection[]>{       
       return new Promise((resolve, reject)=>{ 
        let    evaluar  = function(item:any , index ,array){
            let  itemCollecc =  new Collection();
              itemCollecc.$id_collection = item.id_collection;
              itemCollecc.$description = item.description_collection;
              itemCollecc.creation  = format(new Date(item.creation));
              itemCollecc.id_user = item.id_user;
              itemCollecc.$name = item.name_collection;
              return itemCollecc;
           }       
         let result: Collection[] =  data.map(evaluar);
         resolve(result);
       })   
    }
    public static serachCollec(id:string, collecs:Collection[]){ 
     return collecs.filter((collec)=>{
         return collec.id_collection ==id;
       })
    }
   public static transformDate(value:string){
      return  format( new Date(value));

   }
  public static deleteCollect(id:string , collecs:Collection[]){
    return collecs.filter((collec)=>{
        return collec.id_collection !=id;
      })
  }


    /**
     * Getter $creation
     * @return {string}
     */
	public get $creation(): string {
		return this.creation;
	}

    /**
     * Setter $creation
     * @param {string} value
     */
	public set $creation(value: string) {
		this.creation = value;
	}
    /**
     * Getter $id_collection
     * @return {string}
     */
	public get $id_collection(): string {
		return this.id_collection;
	}

    /**
     * Getter $name
     * @return {string}
     */
	public get $name(): string {
		return this.name;
	}

    /**
     * Getter $description
     * @return {string}
     */
	public get $description(): string {
		return this.description;
	}

    /**
     * Getter $id_user
     * @return {string}
     */
	public get $id_user(): string {
		return this.id_user;
	}

    /**
     * Setter $id_collection
     * @param {string} value
     */
	public set $id_collection(value: string) {
		this.id_collection = value;
	}

    /**
     * Setter $name
     * @param {string} value
     */
	public set $name(value: string) {
		this.name = value;
	}

    /**
     * Setter $description
     * @param {string} value
     */
	public set $description(value: string) {
		this.description = value;
	}

    /**
     * Setter $id_user
     * @param {string} value
     */
	public set $id_user(value: string) {
		this.id_user = value;
	}
   

}



//    id_collection  serial PRIMARY KEY,
//    name_collection  CHARACTER VARYING(40) not NULL,
//    description_collection  CHARACTER VARYING(40) not NULL,
//    id_user CHARACTER VARYING(50) not null, 
//    constraint fk_user_collect foreign key (id_user)
//    references USER_APP(pk_id_user)