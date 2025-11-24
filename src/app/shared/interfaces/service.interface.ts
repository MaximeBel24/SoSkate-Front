import {ServiceType} from '../models/service.type';

export interface ServiceResponse {
  id: number;
  name: string;
  type: ServiceType | null | undefined;
  description: string;
  durationMinutes: number;
  basePriceCents: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceRequest {
  name: string;
  type: ServiceType | null | undefined;
  description: string;
  durationMinutes: number;
  basePriceCents: number;
  isActive: boolean;
}
