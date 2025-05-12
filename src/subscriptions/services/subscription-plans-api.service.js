/**
 * Subscription Plans API Service Client
 * @description This class includes methods for typical REST resource operations.
 */
import http from "@/shared/services/http-common.js";

export class SubscriptionPlansApiService {
  async getAll() {
    const response = await http.get('/plan');
    return response.data;
  }
}