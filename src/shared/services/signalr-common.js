import * as signalR from '@microsoft/signalr';
import { useAuthenticationStore } from '@/auth/services/authentication.store.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Creates a SignalR connection with authentication if the user is signed in.
 * @param {string} hubPath - Path to the SignalR hub (e.g., "/hubs/readings")
 * @returns {HubConnection}
 */
export function createSignalRConnection(hubPath) {
  const authenticationStore = useAuthenticationStore();

  return new signalR.HubConnectionBuilder()
    .withUrl(`${API_BASE_URL}${hubPath}`, {
      accessTokenFactory: () => {
        return authenticationStore.isSignedIn
          ? authenticationStore.currentToken
          : null;
      },
    })
    .withAutomaticReconnect()
    .build();
}
