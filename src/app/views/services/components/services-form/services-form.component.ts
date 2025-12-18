import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { NgSwitch } from '@angular/common';

// Services
import { ServiceService } from '../../../../shared/services/service.service';

// Interfaces & Models
import { ServiceRequest } from '../../../../shared/interfaces/service.interface';
import { ServiceType, ServiceTypeLabel } from '../../../../shared/models/service.type';

// Pipes
import { PricePipe } from '../../../../shared/pipes/price.pipe';
import { DurationPipe } from '../../../../shared/pipes/duration.pipe';

// Composants partagés
import { ConfirmationModalComponent } from '../../../../components/confirmation-modal/confirmation-modal.component';


// Composants de formulaire
import {FormHeaderComponent} from '../../../../components/form/form-header/form-header.component';
import {FormSectionComponent} from '../../../../components/form/form-section/form-section.component';
import {FormInputComponent} from '../../../../components/form/form-input/form-input.component';
import {FormSelectComponent, SelectOption} from '../../../../components/form/form-select/form-select.component';
import {FormTextareaComponent} from '../../../../components/form/form-textarea/form-textarea.component';
import {InfoCardComponent} from '../../../../components/form/info-card/info-card.component';
import {FormActionsComponent} from '../../../../components/form/form-actions/form-actions.component';
import {ValidationSummaryComponent} from '../../../../components/form/validation-summary/validation-summary.component';

// Icônes
import {IconInfoComponent} from '../../../../components/icons/icon-info.component';
import {IconDollarComponent} from '../../../../components/icons/icon-dollar.component';
import {IconActivityComponent} from '../../../../components/icons/icon-activity.component';
import {IconCheckCircleComponent} from '../../../../components/icons/icon-check-circle.component';
import {IconBanComponent} from '../../../../components/icons/icon-ban.component';

@Component({
  selector: 'app-services-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgSwitch,

    // Pipes
    DurationPipe,
    PricePipe,

    // Composants partagés
    ConfirmationModalComponent,

    // Composants de formulaire
    FormHeaderComponent,
    FormSectionComponent,
    FormInputComponent,
    FormSelectComponent,
    FormTextareaComponent,
    InfoCardComponent,
    FormActionsComponent,
    ValidationSummaryComponent,

    // Icônes
    IconInfoComponent,
    IconDollarComponent,
    IconActivityComponent,
    IconCheckCircleComponent,
    IconBanComponent,

  ],
  templateUrl: './services-form.component.html',
  styleUrl: './services-form.component.scss'
})
export class ServicesFormComponent {
  private formBuilder = inject(FormBuilder);
  private serviceService = inject(ServiceService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  // ============================================
  // OPTIONS POUR LES SELECTS
  // ============================================

  readonly serviceTypeOptions: SelectOption[] = [
    { value: ServiceType.LESSON, label: 'Cours de skate', icon: '🎓' },
    { value: ServiceType.PRIVATE_COACHING, label: 'Coaching privé', icon: '👨‍🏫' },
    { value: ServiceType.RENTAL, label: 'Location de matériel', icon: '🛹' },
    { value: ServiceType.SUBSCRIPTION, label: 'Abonnement mensuel', icon: '📅' },
    { value: ServiceType.EVENT, label: 'Événement spécial', icon: '🎉' }
  ];

  readonly statusOptions: SelectOption[] = [
    { value: true, label: '✅ Actif (visible et réservable)' },
    { value: false, label: '❌ Inactif (masqué)' }
  ];

  // Prix rapides prédéfinis (en centimes)
  readonly quickPrices = [
    { cents: 1000, label: '10 €' },
    { cents: 2000, label: '20 €' },
    { cents: 3000, label: '30 €' },
    { cents: 5000, label: '50 €' },
    { cents: 10000, label: '100 €' },
    { cents: 15000, label: '150 €' }
  ];

  // ============================================
  // SIGNALS
  // ============================================

  isLoading = signal(false);
  services = computed(() => this.serviceService.servicesResources.value());

  // Récupération de l'ID du service depuis les params de route
  serviceId = toSignal(
    this.activatedRoute.params.pipe(map((params) => +params['serviceId'] || null))
  );

  // Determine if we're in edit mode
  isEditMode = computed(() => this.serviceId() !== null);

  // ============================================
  // FORM DEFINITION
  // ============================================

  serviceForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
    type: [null as ServiceType | null, [Validators.required]],
    durationMinutes: [0, [Validators.required, Validators.min(1)]],
    basePriceCents: [0, [Validators.required, Validators.min(0)]],
    isActive: [true as boolean | null, [Validators.required]]
  });

  // ============================================
  // MODAL STATE
  // ============================================

  updateModal = {
    isOpen: false,
    isLoading: false
  };

  // ============================================
  // EFFECTS
  // ============================================

  /**
   * Charge les données d'un service existant pour l'édition
   */
  initServiceFormEffect = effect(() => {
    if (this.serviceId()) {
      const services = this.services();

      if (services) {
        const service = services.find(({ id }) => this.serviceId() === id);

        if (service) {
          const { name, description, type, durationMinutes, basePriceCents, isActive } = service;

          this.serviceForm.patchValue({
            name,
            description,
            type,
            durationMinutes,
            basePriceCents,
            isActive
          });

          this.initServiceFormEffect.destroy();
        } else {
          console.error(`Aucun service trouvé pour l'ID ${this.serviceId()}`);
          alert('Service introuvable');
          this.router.navigateByUrl('/services');
        }
      }
    } else {
      this.initServiceFormEffect.destroy();
    }
  });

  // ============================================
  // HELPER METHODS
  // ============================================

  /**
   * Retourne le libellé d'un type de service
   */
  getServiceTypeLabel(type: ServiceType): string {
    return ServiceTypeLabel[type] || type;
  }

  /**
   * Calcule le prix par heure
   */
  calculatePricePerHour(): number {
    const cents = this.serviceForm.get('basePriceCents')?.value!;
    const minutes = this.serviceForm.get('durationMinutes')?.value!;

    if (!minutes || minutes === 0) return 0;

    const pricePerMinute = cents / minutes;
    const pricePerHour = pricePerMinute * 60;

    return Math.round(pricePerHour);
  }

  /**
   * Définit un prix rapide
   */
  setQuickPrice(cents: number): void {
    this.serviceForm.patchValue({ basePriceCents: cents });
  }

  /**
   * Texte d'aide pour la durée
   */
  getDurationHelpText(): string {
    const value = this.serviceForm.get('durationMinutes')?.value;
    if (value && value > 0) {
      const hours = Math.floor(value / 60);
      const mins = value % 60;
      if (hours > 0 && mins > 0) {
        return `⏱️ Durée: ${hours}h${mins.toString().padStart(2, '0')}`;
      } else if (hours > 0) {
        return `⏱️ Durée: ${hours}h`;
      } else {
        return `⏱️ Durée: ${mins} min`;
      }
    }
    return '';
  }

  /**
   * Texte d'aide pour le prix
   */
  getPriceHelpText(): string {
    const value = this.serviceForm.get('basePriceCents')?.value;
    if (value !== null && value !== undefined && value >= 0) {
      return `💰 Prix affiché: ${(value / 100).toFixed(2)} €`;
    }
    return '';
  }

  // ============================================
  // MODAL METHODS
  // ============================================

  openUpdateModal(): void {
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      return;
    }
    this.updateModal.isOpen = true;
  }

  closeUpdateModal(): void {
    this.updateModal = { isOpen: false, isLoading: false };
  }

  async confirmUpdate(): Promise<void> {
    this.updateModal.isLoading = true;

    try {
      const serviceData = this.serviceForm.getRawValue() as ServiceRequest;

      if (this.isEditMode() && this.serviceId()) {
        await this.serviceService.updateService(this.serviceId()!, serviceData);
        console.log('Prestation mise à jour avec succès');
      } else {
        await this.serviceService.createService(serviceData);
        console.log('Prestation créée avec succès');
      }

      await this.router.navigateByUrl('/services');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la sauvegarde');
      this.updateModal.isLoading = false;
    }
  }

  // ============================================
  // FORM SUBMISSION
  // ============================================

  async submit(): Promise<void> {
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    try {
      if (this.serviceId()) {
        this.openUpdateModal();
      } else {
        await this.confirmUpdate();
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      alert(this.isEditMode()
        ? 'Erreur lors de la mise à jour de la prestation.'
        : 'Erreur lors de la création de la prestation.'
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Réinitialise le formulaire
   */
  resetForm(): void {
    this.serviceForm.reset({
      type: null,
      durationMinutes: 0,
      basePriceCents: 0,
      isActive: true
    });
  }
}
