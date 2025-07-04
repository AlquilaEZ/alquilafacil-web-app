<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import NavbarComponent from '../../public/components/Navbar.component.vue';
import { LocalsApiService } from '../../locals/services/locals-api.service';
import { ReadingsApiService } from '../services/readings-api.service';
import { useRoute } from 'vue-router'; 
import { LocalResponse } from '../../locals/model/local.response';
import { ReadingResponse } from '../model/reading.response';
import { ReadingsSignalRService } from '../services/readings-signal.service';
import FooterComponent from '../../public/components/Footer.component.vue';

const localsApiService = new LocalsApiService();
const readingsApiService = new ReadingsApiService();
const readingsSignalRService = new ReadingsSignalRService();

const route = useRoute();
const localId = parseInt(route.params.localId); 

const viewMode = ref('monitoring');

const local = ref({});
const readings = ref([]);
const isLoaded = ref(false);
const incidents = ref([]);

const sensorTypes = {
  SMOKE: 1,
  NOISE: 2,
  CAPACITY: 3,
  RESTRICTEDAREA: 4
}

const handleNewReading = (reading) => {
  const readingResponse = new ReadingResponse(reading);
  readings.value.unshift(readingResponse);
};


onMounted(async () => {
  try {
    const localResponse = await localsApiService.getById(localId);
    local.value = new LocalResponse(localResponse);

    const readingsResponse = await readingsApiService.getByLocalId(localId);
    readings.value = readingsResponse.map(reading => new ReadingResponse(reading));

    await readingsSignalRService.connect(localId, handleNewReading);
    
    isLoaded.value = true;
  } catch (error) {
    console.error("❌ Error al cargar datos iniciales:", error);
  }
});

onBeforeUnmount(async () => {
  await readingsSignalRService.disconnect(localId);
});

const getLatestReadingForSensorTypeId = (id) => readings.value.find(reading => reading.sensorTypeId === id) ?? null;

</script>
<template>
  <NavbarComponent />
  <main class="flex flex-col items-center px-4 sm:px-8 py-10 w-full min-h-[80dvh]">
    <h1 class="text-3xl font-semibold mb-6 text-(--text-color)">Monitoreo e historial</h1>
    <!-- Switch -->
    <div class="flex items-center gap-4 mb-8">
      <button
        @click="viewMode = 'monitoring'"
        :class="viewMode === 'monitoring' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800'"
        class="px-4 py-2 rounded transition-all duration-500"
      >
        Monitoreo en tiempo real
      </button>
      <button
        @click="viewMode = 'incidents'"
        :class="viewMode === 'incidents' ? 'bg-red-600 text-white' : 'bg-gray-300 text-gray-800'"
        class="px-4 py-2 rounded transition-all duration-500"
      >
        Historial de incidencias
      </button>
    </div>
    <!-- Contenedor principal -->
    <template v-if="isLoaded">
      <div class="bg-(--background-card-color) text-(--text-color) rounded-lg shadow-lg p-8 w-full max-w-4xl transition-all duration-700" >
        <h2 class="text-xl font-semibold text-center mb-6">{{ local.localName }}</h2>
        <!-- Vista de monitoreo -->
        <div v-if="viewMode === 'monitoring'" class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <!-- Aforo -->
          <div class="border rounded-lg p-6 flex flex-col items-center">
            <span class="text-4xl mb-2">👤</span>
            <p class="text-2xl font-semibold text-center">
              {{ getLatestReadingForSensorTypeId(sensorTypes.CAPACITY)?.message ?? '0' }}/{{ local.capacity }}
            </p>
            <p class="text-center">Aforo del Espacio</p>
            <p class="text-sm mt-2 text-center">El: {{ getLatestReadingForSensorTypeId(sensorTypes.CAPACITY)?.timestamp ?? new Date().toLocaleString() }}</p>
          </div>
          <!-- Ruido -->
          <div class="border rounded-lg p-6 flex flex-col items-center">
            <span class="text-4xl mb-2">🔊</span>
            <p class="text-2xl font-semibold text-center">
              {{ getLatestReadingForSensorTypeId(sensorTypes.NOISE)?.message ?? '0 dB' }} 
            </p>
            <p class="text-center">Ruido Máximo Registrado</p>
            <p class="text-sm mt-2 text-center">El: {{ getLatestReadingForSensorTypeId(sensorTypes.NOISE)?.timestamp ?? new Date().toLocaleString() }}</p>
          </div>
          <!-- Humo -->
          <div class="border rounded-lg p-6 flex flex-col items-center">
            <span class="text-4xl mb-2">🔥</span>
            <p class="text-2xl font-semibold text-center">
              {{ getLatestReadingForSensorTypeId(sensorTypes.SMOKE)?.message ?? 'Todo en orden' }} 
            </p>
            <p class="text-center">Detección de Humo</p>
            <p class="text-sm mt-2 text-center">El: {{ getLatestReadingForSensorTypeId(sensorTypes.SMOKE)?.timestamp ?? new Date().toLocaleString() }}</p>
          </div>
          <!-- Acceso no autorizado -->
          <div class="border rounded-lg p-6 flex flex-col items-center">
            <span class="text-4xl mb-2 text-center">🚷</span>
            <p class="text-2xl font-semibold">
              {{ getLatestReadingForSensorTypeId(sensorTypes.RESTRICTEDAREA)?.message ?? 'Todo seguro' }}
            </p>
            <p>Traspasos Inautorizados</p>
            <p class="text-sm mt-2 text-center">El: {{ getLatestReadingForSensorTypeId(sensorTypes.RESTRICTEDAREA)?.timestamp ?? new Date().toLocaleString() }}</p>
          </div>
        </div>
        <!-- Vista de incidencias -->
        <div v-else class="flex flex-col gap-4">
          <div v-if="readings.length > 0" class="space-y-4">
            <div
              v-for="(reading, index) in readings"
              :key="index"
              class="border rounded-lg p-4 bg-red-100"
            >
              <p v-if="reading.sensorTypeId === sensorTypes.SMOKE" class="text-red-600 font-semibold">🚨 Alerta de Humo</p>
              <p v-else-if="reading.sensorTypeId === sensorTypes.NOISE" class="text-yellow-600 font-semibold">🔊 Alerta de Ruido</p>
              <p v-else-if="reading.sensorTypeId === sensorTypes.CAPACITY" class="text-blue-600 font-semibold">👥 Actualización de Aforo</p>
              <p v-else-if="reading.sensorTypeId === sensorTypes.RESTRICTEDAREA" class="text-purple-600 font-semibold">🚷 Alerta de Acceso no autorizado</p>
              <p v-if="reading.sensorTypeId === sensorTypes.CAPACITY" class="text-lg text-black">Aforo: {{ reading.message }}/{{ local.capacity }}</p>
              <p v-else class="text-base text-black">Mensaje: {{ reading.message }}</p>
              <p class="text-sm text-gray-600">Detectado el: {{ reading.timestamp }}</p>
            </div>
          </div>
          <p v-else class="text-green-600 text-center text-lg">✅ No se han detectado incidencias.</p>
        </div>
      </div>
    </template>
    <template v-else>
      <p class="text-lg text-center">Cargando datos...</p>
    </template>
  </main>
  <FooterComponent />
</template>