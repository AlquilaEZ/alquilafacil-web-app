/**
 * Comments API Service Client
 * @description This class includes methods for typical REST resource operations.
 */
import http from "../../shared/services/http-common.js";
import { UsersApiService } from "../../shared/services/users-api.service.js";

export class CommentsApiService {
  constructor() {
    this.userApiService = new UsersApiService();
  }
  async getAllByLocalId(localId) {

    const response = await http.get(`/comment/local/${localId}`);
    if(response.data) {
      return Promise.all(response.data.map(async comment => {
        const usernameResponse = await this.userApiService.getUsernameById(comment.userId);
        return {
          ...comment,
          userUsername: usernameResponse
        };
      }));
    }
    else {
      throw new Error('Comments not found');
    }
  }
  async create(commentResource) {
    const response = await http.post('/comment', commentResource);
    return response.data;
  }
}