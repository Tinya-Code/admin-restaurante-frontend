import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
  
  // funcions para transformar la fecha a un formato específico
  transform(date: Date|string|number|null, mode: "short"| "long"|"full" = "short" ): string {
    // verificamos que la vecha sea valida
    if(!date){
      return 'Sin fecha valida';
    }
    // retornamos la fecha formateada seung el modo ingresado
    return new Intl.DateTimeFormat('en-PE', {dateStyle: mode}).format(new Date(date))
  }

}
