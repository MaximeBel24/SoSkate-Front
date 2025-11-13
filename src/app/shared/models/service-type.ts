export enum ServiceType {
  LESSON = 'LESSON',
  RENTAL = 'RENTAL',
  SUBSCRIPTION = 'SUBSCRIPTION',
  EVENT = 'EVENT',
  PRIVATE_COACHING = 'PRIVATE_COACHING',
}

// Libellés lisibles en UI
export const ServiceTypeLabel: Record<ServiceType, string> = {
  [ServiceType.LESSON]: 'Cours de skate',
  [ServiceType.RENTAL]: 'Location de matériel',
  [ServiceType.SUBSCRIPTION]: 'Abonnement mensuel',
  [ServiceType.EVENT]: 'Événement spécial',
  [ServiceType.PRIVATE_COACHING]: 'Coaching privé',
};
