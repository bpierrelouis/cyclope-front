import { httpRequest } from './httpClient';

export const healthResourceName = 'health';

export const getHealth = () => httpRequest(healthResourceName);
