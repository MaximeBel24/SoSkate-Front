import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'price'
})
export class PricePipe implements PipeTransform {

  transform(cents: number | null | undefined, currencySymbol: string = '€'): string {
    if (cents == null || isNaN(cents)) return '-';
    const euros = cents / 100;
    return euros.toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + ` ${currencySymbol}`;
  }
}
