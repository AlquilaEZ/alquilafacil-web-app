import { AuthenticationService } from "./authentication.service.js";
import { defineStore } from "pinia";
import { SignInResponse } from "@/auth/model/sign-in.response.js";
import { SignUpResponse } from "@/auth/model/sign-up.response.js";

const authenticationService = new AuthenticationService();

export const useAuthenticationStore = defineStore('authentication', {
  state: () => ({
    signedIn: !!localStorage.getItem('token'),
    userId: Number(localStorage.getItem('userId')) || 0,
    username: localStorage.getItem('username') || ''
  }),
  getters: {
    isSignedIn: (state) => state.signedIn,
    currentUserId: (state) => state.userId,
    currentUsername: (state) => state.username,
    currentToken: () => localStorage.getItem('token')
  },
  actions: {
    async signIn(signInRequest, router) {
      try {
        const response = await authenticationService.signIn(signInRequest);
        const signInResponse = new SignInResponse(
          response.id,
          response.username,
          response.token
        );

        this.signedIn = true;
        this.userId = signInResponse.id;
        this.username = signInResponse.username;

        localStorage.setItem('token', signInResponse.token);
        localStorage.setItem('userId', signInResponse.id);
        localStorage.setItem('username', signInResponse.username);

        router.push('/');
      } catch (error) {
        console.error('Error en signIn del store:', error);
        throw new Error('Correo o contraseña incorrectos');
      }
    },

    async signUp(signUpRequest, router) {
      try {
        const response = await authenticationService.signUp(signUpRequest);
        const signUpResponse = new SignUpResponse(response.data.message);

        this.signedIn = false;
        this.userId = 0;
        this.username = '';

        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');

        console.log(signUpResponse.message);
        alert('Registro exitoso. Por favor, inicie sesión.');
        router.push('/sign-in');
      } catch (error) {
        console.error(error);
        alert('Error en el registro. Por favor, inténtelo de nuevo más tarde.');
        router.push('/sign-in');
      }
    },

    async signInWithGoogle(router) {
      const googleUser = await authenticationService.signInWithGoogle();
      if (googleUser) {
        console.log('SESION INICIADA Google user:', googleUser);
        // Aquí deberías implementar lo mismo que en signIn con backend real
      } else {
        console.error("Google sign-in failed.");
        router.push('/sign-in');
      }
    },

    async signUpWithGoogle(router) {
      const googleUser = await authenticationService.signInWithGoogle();
      if (googleUser) {
        console.log('REGISTRADO Google user:', googleUser);
        // Aquí deberías implementar el registro con backend real
      } else {
        console.error("Google sign-up failed.");
        router.push('/sign-in');
      }
    },

    async signOut(router) {
      this.signedIn = false;
      this.userId = 0;
      this.username = '';

      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');

      router.push('/sign-in');
    }
  }
});
