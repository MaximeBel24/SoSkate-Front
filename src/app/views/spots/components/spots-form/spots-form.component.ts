import {Component, computed, effect, inject, OnInit, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {SpotService} from '../../../../shared/services/spot.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';
import {SpotRequest} from '../../../../shared/interfaces/spot.interface';
import {CommonModule} from '@angular/common';
import {ConfirmationModalComponent} from '../../../../components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-spots-form',
  imports: [
    ReactiveFormsModule, RouterLink, CommonModule, ConfirmationModalComponent
  ],
  templateUrl: './spots-form.component.html',
  styleUrl: './spots-form.component.scss'
})
export class SpotsFormComponent {
  private formBuilder = inject(FormBuilder);
  private spotService = inject(SpotService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  // Signals
  isLoading = signal(false);


  spots = computed(() => this.spotService.spotsResources.value());
  // Récupération de l'ID du spot depuis les params de route
  spotId = toSignal(
    this.activatedRoute.params.pipe(map((params) => +params['spotId']))
  );

  // Determine if we're in edit mode
  isEditMode = computed(() => this.spotId() !== null);

  // Form definition
  spotForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
    address: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
    city: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
    latitude: [0, [Validators.required, Validators.min(-90), Validators.max(90)]],
    longitude: [0, [Validators.required, Validators.min(-180), Validators.max(180)]],
    isIndoor: [null as boolean | null, [Validators.required]],
    isActive: [true as boolean | null, [Validators.required]],
  });

  /**
   * Charge les données d'un spot existant pour l'édition
   */
  initSpotFormEffect = effect(() => {
    if (this.spotId) {
      const spots = this.spots();

      if (spots) {
        const spot = spots.find(({ id }) => this.spotId() === id);

        if (spot) {
          const { name, description, address, city, zipCode, latitude, longitude, isIndoor, isActive  } = spot;

          this.spotForm.patchValue({
            name,
            description,
            address,
            city,
            zipCode,
            latitude,
            longitude,
            isIndoor,
            isActive
          });

          // Détruit l'effect après initialisation
          this.initSpotFormEffect.destroy();
        } else {
          console.error(`Aucun spot trouvé pour l'ID ${this.spotId}`);
          // Tu peux aussi rediriger ou afficher un message d'erreur ici
        }
      }
    } else {
      this.initSpotFormEffect.destroy();
    }
  });

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
    if (this.spotForm.invalid) {
      this.spotForm.markAllAsTouched();
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
      const spotData = this.spotForm.getRawValue() as SpotRequest;

      if (this.isEditMode() && this.spotId()) {
        await this.spotService.updateSpot(this.spotId()!, spotData);
        console.log('Spot mis à jour avec succès');
      } else {
        await this.spotService.createSpot(spotData);
        console.log('Spot créé avec succès');
      }

      await this.router.navigateByUrl('/spots');
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
    if (this.spotForm.invalid) {
      this.spotForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    try {

      if (this.spotId()) {
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
          ? 'Erreur lors de la mise à jour du spot. Veuillez réessayer.'
          : 'Erreur lors de la création du spot. Veuillez réessayer.'
      );
    } finally {
      this.isLoading.set(false);
    }
  }
}
