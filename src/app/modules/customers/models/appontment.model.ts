import { AppointmentPackage } from './appontment-package.model';

export interface Appointment {
  id: number;
  remarks: string;
  packages: AppointmentPackage[];
}
