import {Component, Input, forwardRef, ContentChild, TemplateRef, HostBinding} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { NgTemplateOutlet } from '@angular/common';

export interface SelectOption {
  value: any;
  label: string;
  icon?: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-form-select',
  imports: [ReactiveFormsModule, NgTemplateOutlet],
  templateUrl: './form-select.component.html',
  styleUrl: './form-select.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormSelectComponent),
      multi: true
    }
  ]
})
export class FormSelectComponent implements ControlValueAccessor {
  // ============================================
  // HOST BINDING - Pour que le composant prenne toute la largeur dans la grille
  // ============================================

  @HostBinding('style.grid-column')
  get gridColumn(): string | null {
    return this.fullWidth ? '1 / -1' : null;
  }

  // ============================================
  // CONFIGURATION
  // ============================================

  /**
   * Label du champ
   */
  @Input({ required: true }) label!: string;

  /**
   * ID unique du champ
   */
  @Input({ required: true }) selectId!: string;

  /**
   * Options du select
   */
  @Input() options: SelectOption[] = [];

  /**
   * Placeholder (première option disabled)
   */
  @Input() placeholder: string = 'Sélectionnez une option';

  /**
   * Champ requis
   */
  @Input() required: boolean = false;

  /**
   * Message d'erreur
   */
  @Input() errorMessage: string = '';

  /**
   * Champ en erreur
   */
  @Input() hasError: boolean = false;

  /**
   * Champ touché
   */
  @Input() touched: boolean = false;

  /**
   * Pleine largeur
   */
  @Input() fullWidth: boolean = false;

  /**
   * Désactivé
   */
  @Input() disabled: boolean = false;

  /**
   * Template personnalisé pour les options
   */
  @ContentChild('optionTemplate') optionTemplate?: TemplateRef<any>;

  // ============================================
  // CONTROL VALUE ACCESSOR
  // ============================================

  value: any = null;
  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onSelectChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    // Gestion des valeurs booléennes et null
    let value: any = target.value;
    if (value === 'true') value = true;
    else if (value === 'false') value = false;
    else if (value === 'null' || value === '') value = null;
    else if (!isNaN(+value) && value !== '') value = +value;

    this.value = value;
    this.onChange(value);
  }

  onBlur(): void {
    this.onTouched();
  }

  get showError(): boolean {
    return this.hasError && this.touched && !!this.errorMessage;
  }

  /**
   * Convertit la valeur pour la comparaison dans le select
   */
  getOptionValue(option: SelectOption): string {
    if (option.value === null) return 'null';
    if (option.value === true) return 'true';
    if (option.value === false) return 'false';
    return String(option.value);
  }

  /**
   * Vérifie si l'option est sélectionnée
   */
  isSelected(option: SelectOption): boolean {
    return this.value === option.value;
  }
}
