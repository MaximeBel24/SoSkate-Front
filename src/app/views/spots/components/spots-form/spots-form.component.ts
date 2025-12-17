import { Component, computed, effect, inject, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

// Services
import { SpotService } from '../../../../shared/services/spot.service';
import { PhotoService } from '../../../../shared/services/photo.service';

// Interfaces & Models
import { SpotRequest, SpotResponse } from '../../../../shared/interfaces/spot.interface';
import { PhotoResponse } from '../../../../shared/interfaces/photo.interface';
import { PhotoEntityType, PhotoType } from '../../../../shared/models/photo.type';

// Composants partagés
import { ConfirmationModalComponent } from '../../../../components/confirmation-modal/confirmation-modal.component';
import { PhotoUploaderComponent } from '../../../../components/form/photo-uploader/photo-uploader.component';

// Composants de formulaire
import {FormHeaderComponent} from '../../../../components/form/form-header/form-header.component';
import {FormSectionComponent} from '../../../../components/form/form-section/form-section.component';
import {FormInputComponent} from '../../../../components/form/form-input/form-input.component';
import {FormTextareaComponent} from '../../../../components/form/form-textarea/form-textarea.component';
import {FormSelectComponent, SelectOption} from '../../../../components/form/form-select/form-select.component';
import {FormActionsComponent} from '../../../../components/form/form-actions/form-actions.component';
import {InfoCardComponent} from '../../../../components/form/info-card/info-card.component';
import {ValidationSummaryComponent} from '../../../../components/form/validation-summary/validation-summary.component';

// Icônes
import {IconInfoComponent} from '../../../../components/icons/icon-info/icon-info.component';
import {IconSunComponent} from '../../../../components/icons/icon-sun/icon-sun.component';
import {IconHomeComponent} from '../../../../components/icons/icon-home/icon-home.component';
import {IconCheckCircleComponent} from '../../../../components/icons/icon-check-circle/icon-check-circle.component';
import {IconBanComponent} from '../../../../components/icons/icon-ban/icon-ban.component';
import {IconImageComponent} from '../../../../components/icons/icon-image/icon-image.component';
import {IconLocationComponent} from '../../../../components/icons/icon-location/icon-location.component';
import {IconActivityComponent} from '../../../../components/icons/icon-activity/icon-activity.component';

@Component({
  selector: 'app-spots-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,

    // Composants partagés
    ConfirmationModalComponent,
    PhotoUploaderComponent,

    // Composants de formulaire
    FormHeaderComponent,
    FormSectionComponent,
    FormInputComponent,
    FormTextareaComponent,
    FormSelectComponent,
    InfoCardComponent,
    FormActionsComponent,
    ValidationSummaryComponent,

    // Icônes
    IconInfoComponent,
    IconSunComponent,
    IconHomeComponent,
    IconCheckCircleComponent,
    IconBanComponent,
    IconImageComponent,
    IconLocationComponent,
    IconActivityComponent,
  ],
  templateUrl: './spots-form.component.html',
  styleUrl: './spots-form.component.scss'
})
export class SpotsFormComponent {
  private formBuilder = inject(FormBuilder);
  private spotService = inject(SpotService);
  private photoService = inject(PhotoService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  // 📸 ViewChild pour accéder au PhotoUploader
  @ViewChild(PhotoUploaderComponent) photoUploader?: PhotoUploaderComponent;

  // 🎯 Enums accessibles dans le template
  readonly PhotoEntityType = PhotoEntityType;
  readonly PhotoType = PhotoType;

  // ============================================
  // OPTIONS POUR LES SELECTS
  // ============================================

  readonly spotTypeOptions: SelectOption[] = [
    { value: false, label: 'Extérieur (Street / Outdoor)' },
    { value: true, label: 'Intérieur (Indoor)' }
  ];

  readonly statusOptions: SelectOption[] = [
    { value: true, label: 'Actif (visible sur l\'application)' },
    { value: false, label: 'Inactif (masqué)' }
  ];

  // ============================================
  // SIGNALS
  // ============================================

  isLoading = signal(false);
  selectedPhotos = signal<File[]>([]);
  currentSpot = signal<SpotResponse | null>(null);
  existingPhotos = signal<PhotoResponse[]>([]);

  spots = computed(() => this.spotService.spotsResources.value());

  // Récupération de l'ID du spot depuis les params de route
  spotId = toSignal(
    this.activatedRoute.params.pipe(map((params) => +params['spotId']))
  );

  // Determine if we're in edit mode
  isEditMode = computed(() => {
    const id = this.spotId();
    return id !== undefined && id !== null && !isNaN(id);
  });

  // ============================================
  // FORM DEFINITION
  // ============================================

  spotForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
    address: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
    city: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
    latitude: [0, [Validators.required, Validators.min(-90), Validators.max(90)]],
    longitude: [0, [Validators.required, Validators.min(-180), Validators.max(180)]],
    isIndoor: [null as boolean | null, [Validators.required]],
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
   * Charge les données d'un spot existant pour l'édition
   */
  initSpotFormEffect = effect(() => {
    if (this.spotId) {
      const spots = this.spots();

      if (spots) {
        const spot = spots.find(({ id }) => this.spotId() === id);

        if (spot) {
          const { name, description, address, city, zipCode, latitude, longitude, isIndoor, isActive } = spot;

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

          this.currentSpot.set(spot);
          this.loadExistingPhotos(spot.id);
          this.initSpotFormEffect.destroy();
        } else {
          console.error(`Aucun spot trouvé pour l'ID ${this.spotId()}`);
        }
      }
    } else {
      this.initSpotFormEffect.destroy();
    }
  });

  // ============================================
  // PHOTO METHODS
  // ============================================

  async loadExistingPhotos(spotId: number): Promise<void> {
    try {
      const photos = await this.photoService.getSpotPhotos(spotId);
      this.existingPhotos.set(photos);
    } catch (error) {
      console.error('Erreur lors du chargement des photos:', error);
      this.existingPhotos.set([]);
    }
  }

  onPhotosSelected(files: File[]): void {
    this.selectedPhotos.set(files);
  }

  onPhotoDeleted(photoId: number): void {
    console.log(`Photo ${photoId} supprimée`);
  }

  onUploadComplete(photos: PhotoResponse[]): void {
    console.log(`${photos.length} photo(s) uploadée(s)`);
    this.selectedPhotos.set([]);
  }

  onUploadError(error: string): void {
    console.error('Erreur upload:', error);
    alert(`Erreur lors de l'upload des photos: ${error}`);
  }

  // ============================================
  // MODAL METHODS
  // ============================================

  openUpdateModal(): void {
    if (this.spotForm.invalid) {
      this.spotForm.markAllAsTouched();
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
      const spotData = this.spotForm.getRawValue() as SpotRequest;
      let createdOrUpdatedSpot: SpotResponse;

      if (this.isEditMode() && this.spotId()) {
        createdOrUpdatedSpot = await this.spotService.updateSpot(this.spotId()!, spotData);
      } else {
        createdOrUpdatedSpot = await this.spotService.createSpot(spotData);
      }

      // Upload des photos si nécessaire
      const photosToUpload = this.selectedPhotos();
      if (photosToUpload.length > 0) {
        try {
          await this.photoService.uploadMultiplePhotos(
            photosToUpload,
            PhotoEntityType.SPOT,
            createdOrUpdatedSpot.id,
            PhotoType.GALLERY
          );
          this.selectedPhotos.set([]);
        } catch (uploadError) {
          console.error('Erreur upload:', uploadError);
          alert('Erreur lors de l\'upload des photos');
        }
      }

      await this.router.navigateByUrl('/spots');
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
    if (this.spotForm.invalid) {
      this.spotForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    try {
      if (this.spotId()) {
        this.openUpdateModal();
      } else {
        await this.confirmUpdate();
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      alert(this.isEditMode()
        ? 'Erreur lors de la mise à jour du spot.'
        : 'Erreur lors de la création du spot.'
      );
    } finally {
      this.isLoading.set(false);
    }
  }
}
