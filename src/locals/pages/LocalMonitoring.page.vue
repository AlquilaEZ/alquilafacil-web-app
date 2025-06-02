<script setup>
import { ref, onMounted } from 'vue';
import { MonitoringApiService } from '../services/monitoring-api.service';
import NavbarComponent from '../../public/components/Navbar.component.vue';
import { useRoute } from 'vue-router'; 

const apiService = new MonitoringApiService();
const route = useRoute();
const localId = parseInt(route.params.id); 

const viewMode = ref('monitoring');
const sensors = ref([]);
const incidents = ref([]);
const limits = ref({
  maxCapacity: 0,
  maxNoiseLevel: 0,
  smokeDetectionEnabled: false,
  restrictedArea: ''
});


onMounted(async () => {
    // Traer límites reales
  limits.value = await apiService.getLocalLimits(localId);
  // MOCK DATA
  
  sensors.value = [
    { type: 'CAPACITY', readings: [{ value: 103, unit: '', timestamp: '27/02/2022 18:59' }] },
    { type: 'NOISE', readings: [{ value: 70, unit: 'dB', timestamp: '27/02/2022 18:59' }] },
    { type: 'SMOKE', readings: [{ value: 0, unit: '', timestamp: 'NN NN' }] },
    { type: 'ACCESS', readings: [{ value: 0, unit: '', timestamp: 'NN NN' }] }
  ];

  incidents.value = [
    { type: 'Aforo excedido', value: '250 / 220', timestamp: '01/06/2025 18:59' },
    { type: 'Ruido excedido', value: '85 dB / 70 dB', timestamp: '01/06/2025 19:10' }
  ];

  
  // sensors.value = await apiService.getSensorsByLocalId(localId);
  // incidents.value = await apiService.getIncidentsByLocalId(localId);
});

const getSensor = (type) => sensors.value.find(s => s.type === type);
const latestReading = (sensor) => sensor?.readings[0] ?? { value: '-', unit: '', timestamp: '-' };
</script>

<template>
      <NavbarComponent />

  <main class="flex flex-col items-center px-4 sm:px-8 py-10 w-full min-h-[80dvh]">
    <h1 class="text-3xl font-semibold mb-6">Reporte e incidencias</h1>

    <!-- Switch -->
    <div class="flex items-center gap-4 mb-8">
      <button
        @click="viewMode = 'monitoring'"
        :class="viewMode === 'monitoring' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800'"
        class="px-4 py-2 rounded transition-all duration-500"
      >
        Monitoreo
      </button>
      <button
        @click="viewMode = 'incidents'"
        :class="viewMode === 'incidents' ? 'bg-red-600 text-white' : 'bg-gray-300 text-gray-800'"
        class="px-4 py-2 rounded transition-all duration-500"
      >
        Incidencias
      </button>
    </div>

    <!-- Contenedor principal -->
    <div
      class="bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl transition-all duration-700"
    >
      <h2 class="text-xl font-semibold text-center mb-6">&lt; Salón Principal &gt;</h2>

      <!-- Vista de monitoreo -->
      <div v-if="viewMode === 'monitoring'" class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <!-- Aforo -->
        <div class="border rounded-lg p-6 flex flex-col items-center">
          <span class="text-4xl mb-2">👤</span>
          <p class="text-2xl font-semibold">
            {{ latestReading(getSensor('CAPACITY')).value }}/{{ limits.maxCapacity }}
          </p>
          <p>Aforo del Espacio</p>
          <p class="text-sm mt-2">En: {{ latestReading(getSensor('CAPACITY')).timestamp }}</p>
        </div>

        <!-- Ruido -->
        <div class="border rounded-lg p-6 flex flex-col items-center">
          <span class="text-4xl mb-2">🔊</span>
          <p class="text-2xl font-semibold">
            {{ latestReading(getSensor('NOISE')).value }} dB / {{ limits.maxNoiseLevel }} dB
          </p>
          <p>Ruido Máximo Registrado</p>
          <p class="text-sm mt-2">En: {{ latestReading(getSensor('NOISE')).timestamp }}</p>
        </div>

        <!-- Humo -->
        <div class="border rounded-lg p-6 flex flex-col items-center">
          <span class="text-4xl mb-2">🔥</span>
          <p class="text-2xl font-semibold">
            {{ latestReading(getSensor('SMOKE')).value > 0 ? 'Sí' : 'No' }}
          </p>
          <p>Detección de Humo</p>
          <p class="text-sm mt-2">En: {{ latestReading(getSensor('SMOKE')).timestamp }}</p>
        </div>

        <!-- Acceso no autorizado -->
        <div class="border rounded-lg p-6 flex flex-col items-center">
          <span class="text-4xl mb-2">🚷</span>
          <p class="text-2xl font-semibold">
            {{ latestReading(getSensor('ACCESS')).value > 0 ? 'Sí' : 'No' }}
          </p>
          <p>Traspasos Inautorizados</p>
          <p class="text-sm mt-2">En: {{ latestReading(getSensor('ACCESS')).timestamp }}</p>
        </div>
      </div>

      <!-- Vista de incidencias -->
      <div v-else class="flex flex-col gap-4">
        <div v-if="incidents.length > 0" class="space-y-4">
          <div
            v-for="(incident, index) in incidents"
            :key="index"
            class="border rounded-lg p-4 bg-red-100"
          >
            <p class="text-lg font-semibold">{{ incident.type }}</p>
            <p class="text-base">Valor: {{ incident.value }}</p>
            <p class="text-sm text-gray-600">Detectado en: {{ incident.timestamp }}</p>
          </div>
        </div>
        <p v-else class="text-green-600 text-center text-lg">✅ No se han detectado incidencias.</p>
      </div>
    </div>
  </main>
</template>
