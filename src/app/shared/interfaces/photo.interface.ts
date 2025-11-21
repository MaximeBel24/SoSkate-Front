/**
 * Type d'entité pour l'upload de photos
 */
export type PhotoEntityType = 'SPOT' | 'CUSTOMER' | 'INSTRUCTOR' | 'EVENT';

/**
 * Type de photo selon le contexte
 */
export type PhotoType = 'AVATAR' | 'COVER' | 'GALLERY' | 'TRICK';

/**
 * Réponse du backend après upload d'une photo
 */
export interface PhotoResponse {
  id: number;
  url: string;
  thumbnailUrl: string;
  entityType: PhotoEntityType;
  entityId: number;
  photoType: PhotoType;
  originalFileName: string;
  fileSize: number;
  mimeType: string;
  width: number;
  height: number;
  displayOrder: number;
  uploadedBy: number;
  uploadedAt: string;
  aspectRatio: string;
  formattedFileSize: string;
}

/**
 * Requête pour uploader une photo
 */
export interface PhotoUploadRequest {
  file: File;
  entityType: PhotoEntityType;
  entityId: number;
  photoType: PhotoType;
  displayOrder: number;
  uploadedBy: number;
}

/**
 * Configuration pour le composant PhotoUploader
 */
export interface PhotoUploaderConfig {
  entityType: PhotoEntityType;
  entityId?: number; // Optionnel en création, requis en édition
  photoType: PhotoType;
  maxPhotos: number;
  maxFileSizeMB: number;
  minWidth: number;
  minHeight: number;
  acceptedFormats: string[];
  allowDelete: boolean;
  showPreview: boolean;
}

/**
 * Fichier avec preview pour affichage avant upload
 */
export interface PhotoFile {
  file: File;
  preview: string;
  displayOrder: number;
  isValid: boolean;
  errorMessage?: string;
}

/**
 * Contraintes de validation pour les photos
 */
export interface PhotoConstraints {
  maxSizeMB: number;
  minWidth: number;
  minHeight: number;
  acceptedFormats: string[];
}

/**
 * Résultat de validation d'une photo
 */
export interface PhotoValidationResult {
  isValid: boolean;
  errors: string[];
}
