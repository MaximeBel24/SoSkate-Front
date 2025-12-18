import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// Services
import { InstructorService } from '../../../../shared/services/instructor.service';

// Interfaces & Models
import { SkateSpecialty, SkateSpecialtyLabel } from '../../../../shared/models/intructor.type';

// Composants partagés
import { ConfirmationModalComponent } from '../../../../components/confirmation-modal/confirmation-modal.component';

// Composants de formulaire
import { FormHeaderComponent } from '../../../../components/form/form-header/form-header.component';
import { FormSectionComponent } from '../../../../components/form/form-section/form-section.component';
import { FormInputComponent } from '../../../../components/form/form-input/form-input.component';
import { FormSelectComponent, SelectOption } from '../../../../components/form/form-select/form-select.component';
import { FormActionsComponent } from '../../../../components/form/form-actions/form-actions.component';
import { InfoCardComponent } from '../../../../components/form/info-card/info-card.component';
import { ValidationSummaryComponent } from '../../../../components/form/validation-summary/validation-summary.component';

// Icônes

import { IconInfoComponent } from '../../../../components/icons/icon-info.component';
import { IconActivityComponent } from '../../../../components/icons/icon-activity.component';
import {InstructorCreateRequest} from '../../../../shared/interfaces/instructor.interface';
import {IconSendComponent} from '../../../../components/icons/icon-send.component';
import {IconMailComponent} from '../../../../components/icons/icon-mail.component';
import {IconAwardComponent} from '../../../../components/icons/icon-award.component';
import {IconUserComponent} from '../../../../components/icons/icon-user.component';

@Component({
  selector: 'app-instructors-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,

    // Composants partagés
    ConfirmationModalComponent,

    // Composants de formulaire
    FormHeaderComponent,
    FormSectionComponent,
    FormInputComponent,
    FormSelectComponent,
    FormActionsComponent,
    InfoCardComponent,
    ValidationSummaryComponent,

    // Icônes

    IconInfoComponent,
    IconActivityComponent,
    IconSendComponent,
    IconMailComponent,
    IconAwardComponent,
    IconUserComponent,
  ],
  templateUrl: './instructors-form.component.html',
  styleUrl: './instructors-form.component.scss'
})
export class InstructorsFormComponent {
  private formBuilder = inject(FormBuilder);
  private instructorService = inject(InstructorService);
  private router = inject(Router);

  // ============================================
  // OPTIONS POUR LES SELECTS
  // ============================================

  readonly specialtyOptions: SelectOption[] = [
    { value: null, label: 'Aucune spécialité' },
    { value: SkateSpecialty.STREET, label: SkateSpecialtyLabel[SkateSpecialty.STREET] },
    { value: SkateSpecialty.VERT, label: SkateSpecialtyLabel[SkateSpecialty.VERT] },
    { value: SkateSpecialty.PARK, label: SkateSpecialtyLabel[SkateSpecialty.PARK] },
    { value: SkateSpecialty.FREESTYLE, label: SkateSpecialtyLabel[SkateSpecialty.FREESTYLE] },
    { value: SkateSpecialty.BOWL, label: SkateSpecialtyLabel[SkateSpecialty.BOWL] },
    { value: SkateSpecialty.LONGBOARD, label: SkateSpecialtyLabel[SkateSpecialty.LONGBOARD] },
  ];

  // Descriptions des spécialités pour les info cards
  readonly specialtyDescriptions: Record<SkateSpecialty, string> = {
    [SkateSpecialty.STREET]: 'Tricks sur mobilier urbain : rails, marches, gaps, ledges...',
    [SkateSpecialty.VERT]: 'Rampes verticales, half-pipes et figures aériennes',
    [SkateSpecialty.PARK]: 'Skateparks avec modules variés : bowls, quarters, spines...',
    [SkateSpecialty.FREESTYLE]: 'Tricks techniques au sol : flips, rotations, combos...',
    [SkateSpecialty.BOWL]: 'Bowls et piscines : carving, grinds, airs...',
    [SkateSpecialty.LONGBOARD]: 'Longboard : dancing, downhill...',
    [SkateSpecialty.CRUISING]: 'Longboard : dancing, downhill...',
  };

  // ============================================
  // SIGNALS
  // ============================================

  isLoading = signal(false);

  // ============================================
  // FORM DEFINITION
  // ============================================

  instructorForm = this.formBuilder.group({
    firstname: ['', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50)
    ]],
    lastname: ['', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50)
    ]],
    email: ['', [
      Validators.required,
      Validators.email,
      Validators.maxLength(100)
    ]],
    phone: ['', [
      Validators.maxLength(15),
      Validators.pattern(/^[+]?[0-9\s-]{0,15}$/)
    ]],
    specialty: [null as SkateSpecialty | null],
    yearsOfExperience: [null as number | null, [
      Validators.min(0),
      Validators.max(50)
    ]]
  });

  // ============================================
  // MODAL STATE
  // ============================================

  confirmModal = {
    isOpen: false,
    isLoading: false
  };

  // ============================================
  // HELPER METHODS
  // ============================================

  /**
   * Retourne le message d'erreur approprié pour l'email
   */
  getEmailErrorMessage(): string {
    const emailControl = this.instructorForm.get('email');

    if (emailControl?.hasError('required')) {
      return 'L\'adresse email est requise';
    }
    if (emailControl?.hasError('email')) {
      return 'L\'adresse email n\'est pas valide';
    }
    if (emailControl?.hasError('maxlength')) {
      return 'L\'email ne peut pas dépasser 100 caractères';
    }

    return 'Email invalide';
  }

  /**
   * Retourne le titre de la spécialité sélectionnée
   */
  getSpecialtyTitle(): string {
    const specialty = this.instructorForm.get('specialty')?.value;
    return specialty ? SkateSpecialtyLabel[specialty] : '';
  }

  /**
   * Retourne la description de la spécialité sélectionnée
   */
  getSpecialtyDescription(): string {
    const specialty = this.instructorForm.get('specialty')?.value;
    return specialty ? this.specialtyDescriptions[specialty] : '';
  }

  // ============================================
  // MODAL METHODS
  // ============================================

  openConfirmModal(): void {
    if (this.instructorForm.invalid) {
      this.instructorForm.markAllAsTouched();
      return;
    }
    this.confirmModal.isOpen = true;
  }

  closeConfirmModal(): void {
    this.confirmModal = { isOpen: false, isLoading: false };
  }

  async confirmInvitation(): Promise<void> {
    this.confirmModal.isLoading = true;

    try {
      const formValue = this.instructorForm.getRawValue();

      // Construction du payload
      const request: InstructorCreateRequest = {
        firstname: formValue.firstname!,
        lastname: formValue.lastname!,
        email: formValue.email!,
        phone: formValue.phone || null,
        specialty: formValue.specialty || null,
        yearsOfExperience: formValue.yearsOfExperience || null
      };

      await this.instructorService.createInstructor(request);

      console.log('Invitation envoyée avec succès');

      // Redirection vers la liste des professeurs
      await this.router.navigate(['/instructors', 'list']);

    } catch (error: any) {
      console.error('Erreur lors de l\'envoi de l\'invitation:', error);

      // Gestion des erreurs spécifiques
      if (error?.status === 409) {
        alert('Cette adresse email est déjà utilisée par un autre compte.');
      } else {
        alert('Erreur lors de l\'envoi de l\'invitation. Veuillez réessayer.');
      }

      this.confirmModal.isLoading = false;
    }
  }

  // ============================================
  // FORM SUBMISSION
  // ============================================

  async submit(): Promise<void> {
    if (this.instructorForm.invalid) {
      this.instructorForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    try {
      this.openConfirmModal();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      alert('Erreur lors de la préparation de l\'invitation.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
