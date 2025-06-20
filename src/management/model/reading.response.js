export class ReadingResponse {
  constructor({localId, sensorTypeId, message, timestamp}) {
    this.localId = localId;
    this.sensorTypeId = sensorTypeId;
    this.message = message;
    this.timestamp = timestamp;
  }
}