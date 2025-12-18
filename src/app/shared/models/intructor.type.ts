export enum IntructorStatus {
  INVITED = 'INVITED',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED'
}

// Libellés lisibles en UI
export const InstructorStatusLabel: Record<IntructorStatus, string> = {
  [IntructorStatus.INVITED]: 'Invité',
  [IntructorStatus.ACTIVE]: 'Actif',
  [IntructorStatus.SUSPENDED]: 'Suspendu',
}

export enum SkateSpecialty {
  STREET = 'STREET',
  BOWL = 'BOWL',
  VERT = 'VERT',
  PARK = 'PARK',
  LONGBOARD = 'LONGBOARD',
  FREESTYLE = 'FREESTYLE',
  CRUISING = 'CRUISING',
}

export const SkateSpecialtyLabel: Record<SkateSpecialty, string> = {
  [SkateSpecialty.STREET]: 'Street',
  [SkateSpecialty.BOWL]: 'Bowl',
  [SkateSpecialty.VERT]: 'Vert',
  [SkateSpecialty.PARK]: 'Park',
  [SkateSpecialty.LONGBOARD]: 'Longboard',
  [SkateSpecialty.FREESTYLE]: 'Freestyle',
  [SkateSpecialty.CRUISING]: 'Cruising',
}
