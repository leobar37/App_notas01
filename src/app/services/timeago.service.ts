import { Injectable } from '@angular/core';
// *timeago js
import { format, render, cancel, register } from 'timeago.js';
@Injectable({
  providedIn: 'root'
})
export class TimeagoService {

  constructor() {
    // ? por arreglar el formato de fecha 
    // const localeFunc = (number: number, index: number, totalSec: number): [string,string]=> {
    //   // number: the timeago / timein number;
    //   // index: the index of array below;
    //   // totalSec: total seconds between date to be formatted and today's date;
    //   return [
    //     ["justo ahora", "ahora mismo"],
    //     ['hace %s segundo', 'en  %s segundos'],
    //     ['hace un inuto', 'en un minuto'],
    //     ['hace %s minutos', 'in %s minutos'],
    //     ['1 hour ago', 'in 1 hour'],
    //     ['%s hours ago', 'in %s hours'],
    //     ['1 day ago', 'in 1 day'],
    //     ['%s days ago', 'in %s days'],
    //     ['1 week ago', 'in 1 week'],
    //     ['%s weeks ago', 'in %s weeks'],
    //     ['1 month ago', 'in 1 month'],
    //     ['%s months ago', 'in %s months'],
    //     ['1 year ago', 'in 1 year'],
    //     ['%s years ago', 'in %s years']
    //   ][index]
    // }; 
    // register('my-locale', localeFunc);

  }
  
   public _format(fecha:Date){
     return format(fecha);
   }
}
