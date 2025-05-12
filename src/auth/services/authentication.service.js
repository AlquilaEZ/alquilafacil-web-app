import http from "@/shared/services/http-common.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export class AuthenticationService {
  async signIn(signInRequest) {
    const response = await http.post('/authentication/sign-in', signInRequest);
    return response.data;
  }

  async signUp(signUpRequest) {
    return await http.post('/authentication/sign-up', signUpRequest);
  }

  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(getAuth(), provider)
      .then((result) => {
        return result.user;
      })
      .catch((error) => {
        console.error("Error signing in with Google: ", error);
        throw error;
      });
  }
}