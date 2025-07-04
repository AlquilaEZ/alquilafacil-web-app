/**
 * Local Edge Nodes API Service Client
 * @description This class includes methods for typical REST resource operations.
 */

import http from '../../shared/services/http-common.js';

export class LocalEdgeNodesApiService {
  async getByLocalId(localId) {
    try {
      const response = await http.get(`/local-edge-nodes/local-id/${localId}`);
      return response.data;
    }
    catch (error) {
      return null;
    }
  }

  async create(resource) {
    const response = await http.post('/local-edge-nodes', resource);
    return response.data;
  }

  async update(localId, resource) {
    const response = await http.put(`/local-edge-nodes/${localId}`, resource);
    return response.data;
  }
}