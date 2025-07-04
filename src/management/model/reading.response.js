export class ReadingResponse {
  constructor({localId, sensorTypeId, message, timestamp}) {
    this.localId = localId;
    this.sensorTypeId = sensorTypeId;
    this.message = message;
    this.timestamp =`${timestamp.split('T')[0] } ${timestamp.split('T')[1].split(':')[0]}:${timestamp.split('T')[1].split(':')[1]}`
  }
}