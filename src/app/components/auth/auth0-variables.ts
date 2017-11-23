import {environment} from '../../../environments/environment';

interface AuthConfig {
  clientID: string;
  domain: string;
  callbackURL: string;
}

export const AUTH_CONFIG: AuthConfig = {
  clientID: '5AoVH0Qx1cIJNndHwlCCX1CGVHtU9XIo',
  domain: 'staff-japan-impact.auth0.com',
  callbackURL: environment.production ? 'https://staff.japan-impact.ch/' : 'http://localhost:4200/'
};
