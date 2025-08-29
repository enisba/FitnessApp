import { Environment } from '@abp/ng.core';

const baseUrl = 'http://localhost:4200';

export const environment = {
  production: true,
  application: {
    baseUrl,
    name: 'FitnessApp',
    logoUrl: '',
  },
  oAuthConfig: {
    issuer: 'https://localhost:44381/',
    redirectUri: baseUrl,
    clientId: 'FitnessApp_App',
    responseType: 'code',
    scope: 'offline_access FitnessApp',
    requireHttps: true
  },
  apis: {
    default: {
      url: 'https://localhost:44381',
      rootNamespace: 'FitnessApp',
    },
  },
} as Environment;
