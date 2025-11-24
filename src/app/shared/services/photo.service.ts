import {inject, Injectable, resource} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  PhotoConstraints,
  PhotoResponse,
  PhotoValidationResult,
} from '../interfaces/photo.interface';
import {environment} from '../../../environments/environment.development';
import {PhotoEntityType, PhotoType} from '../models/photo.type';
import {SpotResponse} from '../interfaces/spot.interface';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/photos`;

  /**
   * Contraintes par défaut pour la validation des photos
   */
  private readonly DEFAULT_CONSTRAINTS: PhotoConstraints = {
    maxSizeMB: 10,
    minWidth: 400,
    minHeight: 400,
    acceptedFormats: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  };

  /**
   * Valide un fichier image selon les contraintes données
   */
  async validatePhoto(
    file: File,
    constraints: PhotoConstraints = this.DEFAULT_CONSTRAINTS
  ): Promise<PhotoValidationResult> {
    const errors: string[] = [];

    // Validation du type MIME
    if (!constraints.acceptedFormats.includes(file.type)) {
      const formats = constraints.acceptedFormats
        .map((f) => f.split('/')[1].toUpperCase())
        .join(', ');
      errors.push(`Format non supporté. Formats acceptés : ${formats}`);
    }

    // Validation de la taille
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > constraints.maxSizeMB) {
      errors.push(
        `Fichier trop volumineux (${fileSizeMB.toFixed(1)} MB). Maximum : ${constraints.maxSizeMB} MB`
      );
    }

    // Validation des dimensions
    try {
      const dimensions = await this.getImageDimensions(file);
      if (
        dimensions.width < constraints.minWidth ||
        dimensions.height < constraints.minHeight
      ) {
        errors.push(
          `Dimensions insuffisantes (${dimensions.width}x${dimensions.height}). Minimum : ${constraints.minWidth}x${constraints.minHeight}px`
        );
      }
    } catch (error) {
      errors.push('Impossible de lire les dimensions de l\'image');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Récupère les dimensions d'une image
   */
  private getImageDimensions(
    file: File
  ): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Impossible de charger l\'image'));
      };

      img.src = objectUrl;
    });
  }

  /**
   * Upload une photo vers le backend
   */
  async uploadPhoto(
    file: File,
    entityType: PhotoEntityType,
    entityId: number,
    photoType: PhotoType,
    displayOrder: number = 0,
    uploadedBy: number = 1 // TODO: Récupérer depuis le contexte d'authentification
  ): Promise<PhotoResponse> {
    // Créer le FormData
    const formData = new FormData();
    formData.append('file', file);
    formData.append('entityType', entityType);
    formData.append('entityId', entityId.toString());
    formData.append('photoType', photoType);
    formData.append('displayOrder', displayOrder.toString());
    formData.append('uploadedBy', uploadedBy.toString());

    // Envoyer la requête
    return firstValueFrom(
      this.http.post<PhotoResponse>(this.API_URL, formData)
    );
  }

  /**
   * Retrieve photos from a specific spot
   */
  async getSpotPhotos(spotId: number): Promise<PhotoResponse[]> {
    return firstValueFrom(
      this.http.get<PhotoResponse[]>(`${this.API_URL}/spots/${spotId}`)
    );
  }

  /**
   * Upload multiple photos en séquence
   */
  async uploadMultiplePhotos(
    files: File[],
    entityType: PhotoEntityType,
    entityId: number,
    photoType: PhotoType,
    startDisplayOrder: number = 0,
    uploadedBy: number = 1
  ): Promise<PhotoResponse[]> {
    const results: PhotoResponse[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const displayOrder = startDisplayOrder + i;

      try {
        const response = await this.uploadPhoto(
          file,
          entityType,
          entityId,
          photoType,
          displayOrder,
          uploadedBy
        );
        results.push(response);
      } catch (error) {
        console.error(`Erreur lors de l'upload de ${file.name}:`, error);
        throw error;
      }
    }

    return results;
  }

  /**
   * Supprime une photo (soft delete)
   */
  async deletePhoto(photoId: number, deletedBy?: number): Promise<void> {
    const params: Record<string, string> = deletedBy
      ? { deletedBy: deletedBy.toString() }
      : {};

    await firstValueFrom(
      this.http.delete<void>(`${this.API_URL}/${photoId}`, { params })
    );
  }

  // /**
  //  * Récupère les photos d'une entité spécifique
  //  */
  // async getPhotosByEntity(
  //   entityType: PhotoEntityType,
  //   entityId: number,
  //   photoType?: PhotoType
  // ): Promise<PhotoResponse[]> {
  //   const params: Record<string, string> = {
  //     entityType,
  //     entityId: entityId.toString(),
  //   };
  //
  //   if (photoType) {
  //     params.photoType = photoType;
  //   }
  //
  //   return firstValueFrom(this.http.get<PhotoResponse[]>(this.API_URL, { params }));
  // }

  /**
   * Formate la taille d'un fichier en format lisible
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Crée une URL de preview pour un fichier
   */
  createPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  /**
   * Libère une URL de preview
   */
  revokePreviewUrl(url: string): void {
    URL.revokeObjectURL(url);
  }
}
