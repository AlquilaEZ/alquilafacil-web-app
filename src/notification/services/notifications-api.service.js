/**
 * Notifications API Service Client
 * @description This class includes methods for typical REST resource operations.
 */
import http from "@/shared/services/http-common.js";

export class NotificationsApiService {
  async getByUserId(userId) {
    const response = await http.get(`/notification/${userId}`);
    return response.data;
  }
}