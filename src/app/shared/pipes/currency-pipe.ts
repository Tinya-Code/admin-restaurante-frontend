import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currency'
})
export class CurrencyPipe implements PipeTransform {

  transform(value: string | number | null | undefined): string {
      //convertimos el valor a número
      const numeroConvertido = Number(value);

      //validamos si la conversion fue exitosa
      if(isNaN(numeroConvertido)){
        return 'S/ 0.00';
      }

    //Formateamos el numero con 2  decimales y agregamos el simbolo
    return `S/ ${numeroConvertido.toFixed(2)}`;
  }

}
