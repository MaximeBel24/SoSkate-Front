import { Component, computed, effect, inject, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpotService } from '../../../../shared/services/spot.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { SpotRequest, SpotResponse } from '../../../../shared/interfaces/spot.interface';
import { CommonModule } from '@angular/common';
import { ConfirmationModalComponent } from '../../../../components/confirmation-modal/confirmation-modal.component';
import { PhotoUploaderComponent } from '../../../../components/photo-uploader/photo-uploader.component';
import { PhotoResponse } from '../../../../shared/interfaces/photo.interface';
import { PhotoEntityType, PhotoType } from '../../../../shared/models/photo.type';
import {PhotoService} from '../../../../shared/services/photo.service';
import {IconAlertCircleComponent} from '../../../../components/icons/icon-alert-circle/icon-alert-circle.component';
import {IconCheckComponent} from '../../../../components/icons/icon-check/icon-check.component';
import {IconImageComponent} from '../../../../components/icons/icon-image/icon-image.component';
import {IconArrowLeftComponent} from '../../../../components/icons/icon-arrow-left/icon-arrow-left.component';
import {IconBanComponent} from '../../../../components/icons/icon-ban/icon-ban.component';
import {IconCheckCircleComponent} from '../../../../components/icons/icon-check-circle/icon-check-circle.component';
import {IconHomeComponent} from '../../../../components/icons/icon-home/icon-home.component';
import {IconSunComponent} from '../../../../components/icons/icon-sun/icon-sun.component';
import {IconActivityComponent} from '../../../../components/icons/icon-activity/icon-activity.component';
import {IconLocationComponent} from '../../../../components/icons/icon-location/icon-location.component';
import {IconInfoComponent} from '../../../../components/icons/icon-info/icon-info.component';

@Component({
  selector: 'app-spots-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    CommonModule,
    ConfirmationModalComponent,
    PhotoUploaderComponent,
    IconAlertCircleComponent,
    IconCheckComponent,
    IconImageComponent,
    IconArrowLeftComponent,
    IconBanComponent,
    IconCheckCircleComponent,
    IconHomeComponent,
    IconSunComponent,
    IconActivityComponent,
    IconLocationComponent,
    IconInfoComponent,
  ],
  templateUrl: './spots-form.component.html',
  styleUrl: './spots-form.component.scss',
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

  // Signals
  isLoading = signal(false);
  selectedPhotos = signal<File[]>([]);
  currentSpot = signal<SpotResponse | null>(null);

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

  // Photos existantes (en mode édition)
  existingPhotos = signal<PhotoResponse[]>([]);

  /**
   * Charge les photos existantes du spot
   */
  async loadExistingPhotos(spotId: number): Promise<void> {
    try {
      console.log('📸 Chargement des photos du spot', spotId);
      const photos = await this.photoService.getSpotPhotos(spotId);
      console.log('✅ Photos chargées:', photos.length, photos);
      this.existingPhotos.set(photos);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des photos:', error);
      this.existingPhotos.set([]);
    }
  }

  // Form definition
  spotForm = this.formBuilder.group({
    name: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ],
    ],
    description: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(1000),
      ],
    ],
    address: [
      '',
      [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(200),
      ],
    ],
    city: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
    ],
    zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
    latitude: [0, [Validators.required, Validators.min(-90), Validators.max(90)]],
    longitude: [
      0,
      [Validators.required, Validators.min(-180), Validators.max(180)],
    ],
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
          const {
            name,
            description,
            address,
            city,
            zipCode,
            latitude,
            longitude,
            isIndoor,
            isActive,
          } = spot;

          this.spotForm.patchValue({
            name,
            description,
            address,
            city,
            zipCode,
            latitude,
            longitude,
            isIndoor,
            isActive,
          });

          // Stocker le spot actuel pour accéder aux photos
          this.currentSpot.set(spot);

          this.loadExistingPhotos(spot.id);

          // Détruit l'effect après initialisation
          this.initSpotFormEffect.destroy();
        } else {
          console.error(`Aucun spot trouvé pour l'ID ${this.spotId()}`);
        }
      }
    } else {
      this.initSpotFormEffect.destroy();
    }
  });

  // ✅ État du modal de mise à jour
  updateModal = {
    isOpen: false,
    isLoading: false,
  };

  /**
   * 📸 Gestion des photos sélectionnées
   */
  onPhotosSelected(files: File[]): void {
    this.selectedPhotos.set(files);
    console.log(`${files.length} photo(s) sélectionnée(s)`);
  }

  /**
   * 🗑️ Gestion de la suppression d'une photo
   */
  onPhotoDeleted(photoId: number): void {
    console.log(`Photo ${photoId} supprimée`);
    // Recharger les données du spot pour mettre à jour la liste
    // Tu peux implémenter une méthode dans spotService pour ça
  }

  /**
   * ✅ Upload terminé avec succès
   */
  onUploadComplete(photos: PhotoResponse[]): void {
    console.log(`${photos.length} photo(s) uploadée(s) avec succès`);
    // Réinitialiser la sélection
    this.selectedPhotos.set([]);
  }

  /**
   * ❌ Erreur lors de l'upload
   */
  onUploadError(error: string): void {
    console.error('Erreur upload:', error);
    alert(`Erreur lors de l'upload des photos: ${error}`);
  }

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
      isLoading: false,
    };
  }

  /**
   * Confirme et exécute la mise à jour
   */
  async confirmUpdate(): Promise<void> {
    this.updateModal.isLoading = true;

    try {
      const spotData = this.spotForm.getRawValue() as SpotRequest;
      let createdOrUpdatedSpot: SpotResponse;

      if (this.isEditMode() && this.spotId()) {
        // Mode édition
        createdOrUpdatedSpot = await this.spotService.updateSpot(
          this.spotId()!,
          spotData
        );
        console.log('✅ Spot mis à jour avec succès:', createdOrUpdatedSpot);
      } else {
        // Mode création
        createdOrUpdatedSpot = await this.spotService.createSpot(spotData);
        console.log('✅ Spot créé avec succès:', createdOrUpdatedSpot);
      }

      console.log('🆔 ID du spot pour l\'upload:', createdOrUpdatedSpot.id);

      // 📸 Upload des photos si nécessaire
      const photosToUpload = this.selectedPhotos();
      console.log('📤 Photos à uploader:', photosToUpload.length, photosToUpload);

      if (photosToUpload.length > 0) {
        console.log('🚀 Début de l\'upload des photos...');

        // ✅ CORRECTION : Uploader manuellement via le service
        // au lieu de déléguer au composant PhotoUploader
        try {
          const uploadResults = await this.photoService.uploadMultiplePhotos(
            photosToUpload,
            PhotoEntityType.SPOT,
            createdOrUpdatedSpot.id,
            PhotoType.GALLERY
          );
          console.log('✅ Upload terminé:', uploadResults.length, 'photos uploadées');

          // Nettoyer la sélection
          this.selectedPhotos.set([]);
        } catch (uploadError) {
          console.error('❌ Erreur upload:', uploadError);
          alert('Erreur lors de l\'upload des photos');
        }
      } else {
        console.log('⏭️ Pas de photos à uploader');
      }

      // Redirection
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
