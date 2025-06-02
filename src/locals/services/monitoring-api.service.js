import http from '../../shared/services/http-common.js';
import { LocalsApiService } from './locals-api.service.js';
import { Sensor } from '../model/sensor.response.js';

export class MonitoringApiService {
  constructor() {
    this.apiBase = '/monitoring'; 
    this.localApiService = new LocalsApiService();
  }

  // Obtener sensores del local
  async getSensorsByLocalId(localId) {
    try {
      const response = await http.get(`${this.apiBase}/locals/${localId}/sensors`);
      return response.data.map(sensor => new Sensor(sensor));
    } catch (error) {
      console.error('Error al obtener sensores:', error);
      throw error;
    }
  }

  // Obtener límites configurados al registrar el local
  async getLocalLimits(localId) {
    try {
      const local = await this.localApiService.getById(localId);
      return {
        maxCapacity: local.capacity,
        maxNoiseLevel: local.noiseLevel,
        smokeDetectionEnabled: local.smokeDetection,
        restrictedArea: local.restrictedArea
      };
    } catch (error) {
      console.error('Error al obtener límites del local:', error);
      throw error;
    }
  }

  // Revisar incidencias activas según límites y lecturas recientes
  async getIncidentsByLocalId(localId) {
    try {
      const sensors = await this.getSensorsByLocalId(localId);
      const limits = await this.getLocalLimits(localId);

      const incidents = [];

      // Aforo
      const capacitySensor = sensors.find(s => s.type === 'CAPACITY');
      const latestCapacity = capacitySensor?.readings[0];
      if (latestCapacity && latestCapacity.value > limits.maxCapacity) {
        incidents.push({
          type: 'Aforo excedido',
          value: `${latestCapacity.value}/${limits.maxCapacity}`,
          timestamp: latestCapacity.timestamp
        });
      }

      // Ruido
      const noiseSensor = sensors.find(s => s.type === 'NOISE');
      const latestNoise = noiseSensor?.readings[0];
      if (latestNoise && latestNoise.value > limits.maxNoiseLevel) {
        incidents.push({
          type: 'Ruido excedido',
          value: `${latestNoise.value} dB / ${limits.maxNoiseLevel} dB`,
          timestamp: latestNoise.timestamp
        });
      }

      // Humo
      const smokeSensor = sensors.find(s => s.type === 'SMOKE');
      const latestSmoke = smokeSensor?.readings[0];
      if (limits.smokeDetectionEnabled && latestSmoke && latestSmoke.value > 0) {
        incidents.push({
          type: 'Detección de humo',
          value: 'Humo detectado',
          timestamp: latestSmoke.timestamp
        });
      }

      // Accesos no autorizados
      const accessSensor = sensors.find(s => s.type === 'ACCESS');
      const latestAccess = accessSensor?.readings[0];
      if (limits.restrictedArea && latestAccess && latestAccess.value > 0) {
        incidents.push({
          type: 'Acceso no autorizado',
          value: `Intentos detectados`,
          timestamp: latestAccess.timestamp
        });
      }

      return incidents;
    } catch (error) {
      console.error('Error al calcular incidencias:', error);
      throw error;
    }
  }
}
