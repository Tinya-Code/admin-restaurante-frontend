import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
  
  // funcions para transformar la fecha a un formato específico
  transform(  date: Date|string|number|null, 
              mode: "short"| "long"|"full" = "short" )
              :string 
            {
    // verificamos que la vecha sea valida y que sean un valor utilizable
    if(date === null || date === undefined || isNaN(new Date(date).getTime()) ) {
      return '';
    }
    // retornamos la fecha formateada seung el modo ingresado
    return new Intl.DateTimeFormat('es-PE', {dateStyle: mode}).format(new Date(date))
  }

}
