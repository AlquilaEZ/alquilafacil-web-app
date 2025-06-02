export class Reading {
    constructor({ id, sensorId, timestamp, value, unit }) {
      this.id = id;
      this.sensorId = sensorId;
      this.timestamp = timestamp;
      this.value = value;
      this.unit = unit;
    }
  }
  