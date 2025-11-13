import {Component, computed, effect, inject, OnInit, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';
import {ServiceService} from '../../../../shared/services/service.service';
import {ServiceRequest} from '../../../../shared/interfaces/service.interface';
import {PricePipe} from '../../../../shared/pipes/price.pipe';
import {DurationPipe} from '../../../../shared/pipes/duration.pipe';
import {ServiceType, ServiceTypeLabel} from '../../../../shared/models/service-type';
import {SpotRequest} from '../../../../shared/interfaces/spot.interface';
import {ConfirmationModalComponent} from '../../../../components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-services-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    DurationPipe,
    PricePipe,
    ConfirmationModalComponent
  ],
  templateUrl: './services-form.component.html',
  styleUrl: './services-form.component.scss'
})
export class ServicesFormComponent {
  private formBuilder = inject(FormBuilder);
  private serviceService = inject(ServiceService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  // Signals
  isLoading = signal(false);

  services = computed(() => this.serviceService.servicesResources.value());

  // Récupération de l'ID du service depuis les params de route
  serviceId = toSignal(
    this.activatedRoute.params.pipe(map((params) => +params['serviceId'] || null))
  );

  // Determine if we're in edit mode
  isEditMode = computed(() => this.serviceId() !== null);

  // Types de services disponibles
  serviceTypes = [
    { value: ServiceType.LESSON, label: 'Cours de skate', icon: '🎓' },
    { value: ServiceType.PRIVATE_COACHING, label: 'Coaching privé', icon: '👨‍🏫' },
    { value: ServiceType.RENTAL, label: 'Location de matériel', icon: '🛹' },
    { value: ServiceType.SUBSCRIPTION, label: 'Abonnement mensuel', icon: '📅' },
    { value: ServiceType.EVENT, label: 'Événement spécial', icon: '🎉' },
  ];

  // Prix rapides prédéfinis (en centimes)
  quickPrices = [
    { cents: 1000, label: '10 €' },
    { cents: 2000, label: '20 €' },
    { cents: 3000, label: '30 €' },
    { cents: 5000, label: '50 €' },
    { cents: 10000, label: '100 €' },
    { cents: 15000, label: '150 €' },
  ];

  // Form definition
  serviceForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
    type: [null as ServiceType | null, [Validators.required]],
    durationMinutes: [0, [Validators.required, Validators.min(1)]],
    basePriceCents: [0, [Validators.required, Validators.min(0)]],
    isActive: [true as boolean | null, [Validators.required]],
  });

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

          // Détruit l'effect après initialisation
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

  // ✅ État du modal de mise à jour
  updateModal = {
    isOpen: false,
    isLoading: false
  };

  /**
   * Ouvre le modal de confirmation avant soumission
   */
  openUpdateModal(): void {
    // Valider d'abord le formulaire
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      return;
    }

    this.updateModal.isOpen = true;
  }

  /**
   * Ferme le modal de mise à jour
   */
  closeUpdateModal(): void {
    this.updateModal = {
      isOpen: false,
      isLoading: false
    };
  }

  /**
   * Confirme et exécute la mise à jour
   */
  async confirmUpdate(): Promise<void> {
    this.updateModal.isLoading = true;

    try {
      const serviceData = this.serviceForm.getRawValue() as ServiceRequest;

      if (this.isEditMode() && this.serviceId()) {
        await this.serviceService.updateService(this.serviceId()!, serviceData);
        console.log('Prestation mis à jour avec succès');
      } else {
        await this.serviceService.createService(serviceData);
        console.log('Spot créé avec succès');
      }

      await this.router.navigateByUrl('/services');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la sauvegarde');
      this.updateModal.isLoading = false;
    }
  }

  /**
   * Soumet le formulaire (création ou mise à jour)
   */
  async submit(): Promise<void> {
    // Marquer tous les champs comme touched pour afficher les erreurs
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    try {

      if (this.serviceId()) {
        // Mode édition
        this.openUpdateModal();
      } else {
        // Mode création
        await this.confirmUpdate();
      }

    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
      alert(
        this.isEditMode()
          ? 'Erreur lors de la mise à jour du service. Veuillez réessayer.'
          : 'Erreur lors de la création du service. Veuillez réessayer.'
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
      isActive: true,
    });
  }
}
