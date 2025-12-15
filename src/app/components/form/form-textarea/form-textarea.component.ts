import {Component, Input, forwardRef, HostBinding} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-textarea',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-textarea.component.html',
  styleUrl: './form-textarea.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormTextareaComponent),
      multi: true
    }
  ]
})
export class FormTextareaComponent implements ControlValueAccessor {

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
  @Input({ required: true }) textareaId!: string;

  /**
   * Placeholder
   */
  @Input() placeholder: string = '';

  /**
   * Nombre de lignes
   */
  @Input() rows: number = 5;

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
  @Input() fullWidth: boolean = true;

  /**
   * Longueur maximale
   */
  @Input() maxlength: string = '';

  /**
   * Désactivé
   */
  @Input() disabled: boolean = false;

  // ============================================
  // CONTROL VALUE ACCESSOR
  // ============================================

  value: string = '';
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onTextareaChange(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.value = target.value;
    this.onChange(target.value);
  }

  onBlur(): void {
    this.onTouched();
  }

  get showError(): boolean {
    return this.hasError && this.touched && !!this.errorMessage;
  }

  get characterCount(): number {
    return this.value?.length || 0;
  }
}
