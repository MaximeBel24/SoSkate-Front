import {IntructorStatus, SkateSpecialty} from '../models/intructor.type';

/**
 * Backend response who contains all public information
 */
export interface InstructorResponse {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  status: IntructorStatus;
  bio: string;
  specialty: SkateSpecialty | null | undefined;
  yearsOfExperience: number;
  instagramHandle: string;
  youtubeChannel: string;
  createdAt: Date;
  updatedAt: Date;
  invitedAt: Date;
  activatedAt: Date;
}

/**
 * Request interface for creating a new instructor account by an admin.
 * Only basic information is required at this stage.
 * The instructor will complete their profile after activation.
 */
export interface InstructorCreateRequest {
  /** @minLength 2 @maxLength 50 */
  firstname: string;

  /** @minLength 2 @maxLength 50 */
  lastname: string;

  /** @maxLength 100 */
  email: string;

  /** @maxLength 15 @pattern ^[+]?[0-9\s-]{0,15}$ */
  phone?: string | null;

  /** Optional: Admin can pre-fill the specialty if known */
  specialty?: SkateSpecialty | null;

  /** Optional: Admin can pre-fill years of experience if known @min 0 @max 50 */
  yearsOfExperience?: number | null;
}
