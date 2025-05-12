/**
 * Subscriptions API Service Client
 * @description This class includes methods for typical REST resource operations.
 */
import http from "../../shared/services/http-common.js";

export class SubscriptionsApiService {
  async create(subscriptionResource) {
    const response = await http.post('/subscriptions', subscriptionResource);
    return response.data;
  }
  async getAll() {
    const response = await http.get('/subscriptions');
    console.log(response.data);
    return response.data;
  }
  async getById(id) {
    const response = await http.get(`/subscriptions/${id}`);
    return response.data;
  }
  async activeSubscriptionStatus(subscriptionId) {
    const response = await http.put(`/subscriptions/${subscriptionId}`);
    return response.data;
  }
}