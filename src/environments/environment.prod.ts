import { baseEnv } from './environment.base';

export const environment = {
  ...baseEnv,
  production: true,
  name: 'Melos',
  apiUrl: 'http://46.137.230.248:8001',
  apiVersion: 'v1',
  dateFormat: 'dd MMM yyyy',
  dateTimeFormat: 'dd MMM yyyy h:mm a',
};
