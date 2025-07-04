import { createSignalRConnection } from '@/shared/services/signalr-common.js';

export class ReadingsSignalRService {
  constructor() {
    this.connection = null;
  }

  async connect(localId, onReadingReceivedCallback) {
    this.connection = createSignalRConnection('/hubs/readings');

    this.connection.on("ReadingReceivedEvent", onReadingReceivedCallback);

    await this.connection.start();
    await this.connection.invoke("JoinLocalGroup", localId);
  }

  async disconnect(localId) {
    if (this.connection) {
      await this.connection.invoke("LeaveLocalGroup", localId);
      await this.connection.stop();
    }
  }
}
