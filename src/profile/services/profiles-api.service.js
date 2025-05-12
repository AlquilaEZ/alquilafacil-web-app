/**
 * Profiles API Service Client
 * @description This class includes methods for typical REST resource operations.
 */
import http from "../../shared/services/http-common.js";

export class ProfilesApiService {

  async getByUserId(userId) {
    const response = await http.get(`/profiles/user/${userId}`);
    return response.data;
  } 
  async update(id, profileResource) {
    const response = await http.put(`/profiles/${id}`, profileResource);
    return response.data;
  }
  async getSubscriptionStatusByUserId(userId) {
    const response = await http.get(`/profiles/subscription-status/${userId}`);
    return response.data;
  }
  async getBankAccountsByUserId(userId) {
    const response = await http.get(`/profiles/bank-accounts/${userId}`);
    const [bankAccountNumber, interbankAccountNumber] = response.data;
    return { bankAccountNumber, interbankAccountNumber };
  }
}