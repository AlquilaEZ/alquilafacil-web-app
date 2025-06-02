export class Sensor {
    constructor({ id, code, type, state, location, localId, readings }) {
      this.id = id;
      this.code = code;
      this.type = type;
      this.state = state;
      this.location = location;
      this.localId = localId;
      this.readings = readings.map(r => new Reading(r));
    }
  }
  