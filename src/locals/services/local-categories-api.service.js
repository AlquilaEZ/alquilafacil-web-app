/**
 * Local Categories API Service Client
 * @description This class includes methods for typical REST resource operations.
 */
import http from "../../shared/services/http-common.js";

export class LocalCategoriesApiService {
  async getAll() {
    const response = await http.get('/local-categories');
    return response.data;
  }
}