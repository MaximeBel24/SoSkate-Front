import {Component, computed, EventEmitter, HostListener, inject, input, Output, signal,} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PhotoService} from '../../../shared/services/photo.service';
import {PhotoConstraints, PhotoFile, PhotoResponse,} from '../../../shared/interfaces/photo.interface';
import {PhotoEntityType, PhotoType} from '../../../shared/models/photo.type';

@Component({
  selector: 'app-photo-uploader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './photo-uploader.component.html',
  styleUrl: './photo-uploader.component.scss',
})
export class PhotoUploaderComponent {
  protected photoService = inject(PhotoService);

  // 📥 Inputs
  entityType = input.required<PhotoEntityType>();
  entityId = input<number | null>(null); // Null en création, number en édition
  photoType = input<PhotoType>(PhotoType.GALLERY);
  maxPhotos = input<number>(20);
  existingPhotos = input<PhotoResponse[]>([]);

  // Contraintes de validation
  constraints = input<PhotoConstraints>({
    maxSizeMB: 10,
    minWidth: 400,
    minHeight: 400,
    acceptedFormats: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  });

  // 📤 Outputs
  @Output() photosSelected = new EventEmitter<File[]>();
  @Output() photoDeleted = new EventEmitter<number>();
  @Output() uploadComplete = new EventEmitter<PhotoResponse[]>();
  @Output() uploadError = new EventEmitter<string>();

  // 🎯 État du composant
  isDragging = signal(false);
  selectedFiles = signal<PhotoFile[]>([]);
  isUploading = signal(false);
  uploadProgress = signal(0);

  // 📊 Computed
  totalPhotos = computed(
    () => this.existingPhotos().length + this.selectedFiles().length
  );
  canAddMore = computed(() => this.totalPhotos() < this.maxPhotos());
  remainingSlots = computed(() => this.maxPhotos() - this.totalPhotos());

  // 🎨 Format accepté pour l'input file
  acceptedFormatsString = computed(() =>
    this.constraints().acceptedFormats.join(',')
  );

  /**
   * 📁 Gestion de la sélection de fichiers via input
   */
  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      await this.handleFiles(Array.from(input.files));
    }
    // Reset input pour permettre de sélectionner le même fichier
    input.value = '';
  }

  /**
   * 🎯 Traitement des fichiers sélectionnés
   */
  private async handleFiles(files: File[]): Promise<void> {
    // Vérifier si on peut ajouter plus de photos
    const availableSlots = this.remainingSlots();
    if (availableSlots <= 0) {
      this.uploadError.emit(
        `Vous avez atteint la limite de ${this.maxPhotos()} photos`
      );
      return;
    }

    // Limiter au nombre de slots disponibles
    const filesToProcess = files.slice(0, availableSlots);

    if (files.length > availableSlots) {
      this.uploadError.emit(
        `Seulement ${availableSlots} photo(s) peuvent être ajoutée(s)`
      );
    }

    // Valider et créer les previews
    const newPhotoFiles: PhotoFile[] = [];

    for (const file of filesToProcess) {
      const validation = await this.photoService.validatePhoto(
        file,
        this.constraints()
      );

      const photoFile: PhotoFile = {
        file,
        preview: this.photoService.createPreviewUrl(file),
        displayOrder: this.totalPhotos() + newPhotoFiles.length,
        isValid: validation.isValid,
        errorMessage: validation.errors.join(', '),
      };

      newPhotoFiles.push(photoFile);
    }

    // Ajouter à la liste
    this.selectedFiles.update((current) => [...current, ...newPhotoFiles]);

    // Émettre l'événement avec tous les fichiers valides
    const validFiles = this.selectedFiles()
      .filter((pf) => pf.isValid)
      .map((pf) => pf.file);
    this.photosSelected.emit(validFiles);
  }

  /**
   * 🗑️ Supprimer un fichier sélectionné (avant upload)
   */
  removeSelectedFile(index: number): void {
    const files = this.selectedFiles();
    const photoFile = files[index];

    // Libérer l'URL de preview
    this.photoService.revokePreviewUrl(photoFile.preview);

    // Retirer de la liste
    this.selectedFiles.update((current) =>
      current.filter((_, i) => i !== index)
    );

    // Émettre l'événement avec les fichiers valides restants
    const validFiles = this.selectedFiles()
      .filter((pf) => pf.isValid)
      .map((pf) => pf.file);
    this.photosSelected.emit(validFiles);
  }

  /**
   * 🗑️ Supprimer une photo existante (déjà uploadée)
   */
  async deleteExistingPhoto(photoId: number): Promise<void> {
    try {
      await this.photoService.deletePhoto(photoId);
      this.photoDeleted.emit(photoId);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      this.uploadError.emit('Erreur lors de la suppression de la photo');
    }
  }

  /**
   * 📤 Upload toutes les photos sélectionnées
   */
  async uploadPhotos(): Promise<void> {
    const entityIdValue = this.entityId();

    if (!entityIdValue) {
      this.uploadError.emit(
        'Impossible d\'uploader sans ID d\'entité (créez d\'abord le spot)'
      );
      return;
    }

    const validFiles = this.selectedFiles()
      .filter((pf) => pf.isValid)
      .map((pf) => pf.file);

    if (validFiles.length === 0) {
      this.uploadError.emit('Aucune photo valide à uploader');
      return;
    }

    this.isUploading.set(true);
    this.uploadProgress.set(0);

    try {
      const results = await this.photoService.uploadMultiplePhotos(
        validFiles,
        this.entityType(),
        entityIdValue,
        this.photoType()
      );

      // Nettoyer les previews
      this.selectedFiles().forEach((pf) =>
        this.photoService.revokePreviewUrl(pf.preview)
      );
      this.selectedFiles.set([]);

      this.uploadProgress.set(100);
      this.uploadComplete.emit(results);
    } catch (error: any) {
      console.error('Erreur lors de l\'upload:', error);
      this.uploadError.emit(
        error?.message || 'Erreur lors de l\'upload des photos'
      );
    } finally {
      this.isUploading.set(false);
    }
  }

  /**
   * 🎯 Drag & Drop handlers
   */
  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  @HostListener('drop', ['$event'])
  async onDrop(event: DragEvent): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      await this.handleFiles(Array.from(files));
    }
  }

  /**
   * 🧹 Cleanup on destroy
   */
  ngOnDestroy(): void {
    // Libérer toutes les URLs de preview
    this.selectedFiles().forEach((pf) =>
      this.photoService.revokePreviewUrl(pf.preview)
    );
  }
}
