import {Component, Input, forwardRef, signal, HostBinding} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormControl } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './form-input.component.html',
  styleUrl: './form-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputComponent),
      multi: true
    }
  ]
})
export class FormInputComponent implements ControlValueAccessor {
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
   * ID unique du champ (pour le label htmlFor)
   */
  @Input({ required: true }) inputId!: string;

  /**
   * Type d'input
   */
  @Input() type: 'text' | 'number' | 'email' | 'password' | 'tel' | 'url' = 'text';

  /**
   * Placeholder
   */
  @Input() placeholder: string = '';

  /**
   * Champ requis
   */
  @Input() required: boolean = false;

  /**
   * Message d'erreur à afficher
   */
  @Input() errorMessage: string = '';

  /**
   * Texte d'aide sous le champ
   */
  @Input() helpText: string = '';

  /**
   * Champ en erreur (état externe)
   */
  @Input() hasError: boolean = false;

  /**
   * Champ touché (état externe)
   */
  @Input() touched: boolean = false;

  /**
   * Attribut step pour les inputs number
   */
  @Input() step: string = '';

  /**
   * Attribut min pour les inputs number
   */
  @Input() min: string = '';

  /**
   * Attribut max pour les inputs number
   */
  @Input() max: string = '';

  /**
   * Attribut maxlength
   */
  @Input() maxlength: string = '';

  /**
   * Pleine largeur (full-width class)
   */
  @Input() fullWidth: boolean = false;

  /**
   * Addon à droite de l'input
   */
  @Input() addon: string = '';

  /**
   * Addon à gauche de l'input
   */
  @Input() addonLeft: string = '';

  /**
   * Désactivé
   */
  @Input() disabled: boolean = false;

  // ============================================
  // CONTROL VALUE ACCESSOR
  // ============================================

  value: any = '';
  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: any): void {
    this.value = value ?? '';
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

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = this.type === 'number' ? +target.value : target.value;
    this.value = value;
    this.onChange(value);
  }

  onBlur(): void {
    this.onTouched();
  }

  /**
   * Détermine si l'erreur doit être affichée
   */
  get showError(): boolean {
    return this.hasError && this.touched && !!this.errorMessage;
  }
}
