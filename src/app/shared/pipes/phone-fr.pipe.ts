import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneFr'
})
export class PhoneFrPipe implements PipeTransform {

  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    // Nettoyage : on enlève tout sauf chiffres
    let digits = value.replace(/\D/g, '');

    // Cas +33
    if (digits.startsWith('33')) {
      digits = '0' + digits.substring(2);
    }

    // Validation simple (France = 10 chiffres)
    if (digits.length !== 10) {
      return value; // on renvoie brut si doute
    }

    // Format : 06 12 34 56 78
    return digits.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
  }
}
