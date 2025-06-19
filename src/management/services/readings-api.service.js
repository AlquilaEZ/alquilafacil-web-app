/**
 * Readings API Service Client
 * @description This class includes methods for typical REST resource operations.
 */

import http from '../../shared/services/http-common.js';
import { ReadingResponse } from '../model/reading.response.js';

export class ReadingsApiService {
  async getByLocalId(localId) {
    const response = await http.get(`/readings/local-id/${localId}`);
    return response.data;
  }
}