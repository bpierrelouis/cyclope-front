import { Mission } from '../models';
import { createCrudService } from './crud.factory';

export const missionsResourceName = 'missions';

const service = createCrudService(missionsResourceName, Mission.mapper);

export const missionsService = service;
