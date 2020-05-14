export interface Ieditor {
 time:number,
 blocks : [
     {
         type:string,
         data:any
     }
 ],
 version :string
}

export interface Ichecklist{
  items : [ 
       {
         text: string,
         checked :boolean
       }
  ]   
}

export interface Ilist{
  style:string;
  items: string[]
}

export const transform_data =(data: Ieditor)=>{
   

}

