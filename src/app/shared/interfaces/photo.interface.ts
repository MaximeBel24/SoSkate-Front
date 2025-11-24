import {PhotoEntityType} from '../models/photo.type';
import {PhotoType} from '../models/photo.type';

/**
 * Backend response after uploading a photo
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
 * Request to upload a photo
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
 * Configuration for the PhotoUploader component
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
