import {InstructorSummary} from './instructor.interface';
import {SpotSummary} from './spot.interface';
import {ServiceSummary} from './service.interface';

export interface BookingResponse {
  id: number;
  instructor: InstructorSummary;
  spot: SpotSummary;
  service: ServiceSummary;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  maxParticipants: number;
  confirmedParticipants: number;
  availablePlaces: number;
  participants: ParticipantSummary[];
  status: string;
  notes: string;
  createdAt: string;
}

export interface ParticipantSummary {
  id: number;
  customerId: number;
  customerName: string;
  numberOfParticipants: number;
  status: string;
  amountCents: number;
  invitedBy: string;
  participantsNotes: string;
}

