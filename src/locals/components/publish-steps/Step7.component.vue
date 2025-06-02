<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  localName: String,
  descriptionMessage: String,
  capacity: String,
  noiseLevel: String,
  restrictedArea: String,
  features: Array,
  smokeDetection: Boolean,
});

const emit = defineEmits([
  'update:localName',
  'update:descriptionMessage',
  'update:capacity',
  'update:noiseLevel',
  'update:restrictedArea',
  'update:features',
  'update:smokeDetection'
]);

const newFeature = ref('');

// refs locales para inputs
const localNoiseLevel = ref(props.noiseLevel || '');
const localRestrictedArea = ref(props.restrictedArea || '');
const smokeMonitorActive = ref(props.smokeDetection || false);
const noiseMonitorActive = ref(!!props.noiseLevel);
const restrictedAreaMonitorActive = ref(!!props.restrictedArea);

// sync props if they change (optional)
watch(() => props.noiseLevel, (newVal) => {
  localNoiseLevel.value = newVal || '';
});
watch(() => props.restrictedArea, (newVal) => {
  localRestrictedArea.value = newVal || '';
});
watch(() => props.smokeDetection, (newVal) => {
  smokeMonitorActive.value = newVal || false;
});

// emitir booleano directamente para humo
watch(smokeMonitorActive, (newVal) => {
  emit('update:smokeDetection', newVal);
});

// emitir valores de ruido solo si activo
watch(localNoiseLevel, (newVal) => {
  if (noiseMonitorActive.value) {
    emit('update:noiseLevel', newVal);
  }
});

// emitir valores de área solo si activo
watch(localRestrictedArea, (newVal) => {
  if (restrictedAreaMonitorActive.value) {
    emit('update:restrictedArea', newVal);
  }
});

// si apagas el switch, limpiar (opcional)
watch(noiseMonitorActive, (active) => {
  if (!active) {
    emit('update:noiseLevel', '');
  } else {
    emit('update:noiseLevel', localNoiseLevel.value);
  }
});

watch(restrictedAreaMonitorActive, (active) => {
  if (!active) {
    emit('update:restrictedArea', '');
  } else {
    emit('update:restrictedArea', localRestrictedArea.value);
  }
});

const addFeature = () => {
  const trimmed = newFeature.value.trim();
  if (trimmed && !props.features.includes(trimmed)) {
    emit('update:features', [...props.features, trimmed]);
    newFeature.value = '';
  }
};

const removeFeature = (index) => {
  const updated = [...props.features];
  updated.splice(index, 1);
  emit('update:features', updated);
};
</script>

<template>
  <h1 class="text-3xl text-center font-semibold">Ahora, añade los detalles de tu espacio</h1>
  <p class="text-lg text-center">Los títulos cortos funcionan mejor. No te preocupes, puedes modificarlo más adelante.</p>

  <!-- Nombre -->
  <div class="flex flex-col w-full max-w-140">
    <label class="text-lg font-semibold">Nombre</label>
    <input
      type="text"
      :value="props.localName"
      @input="emit('update:localName', $event.target.value)"
      class="border border-gray-300 rounded px-4 py-4"
      placeholder="Ingresa el nombre de tu local"
    />
  </div>

  <!-- Descripción -->
  <div class="flex flex-col w-full max-w-140">
    <label class="text-lg font-semibold">Descripción</label>
    <input
      type="text"
      :value="props.descriptionMessage"
      @input="emit('update:descriptionMessage', $event.target.value)"
      class="border border-gray-300 rounded px-4 py-4"
      placeholder="Ingresa la descripción de tu local"
    />
  </div>

  <!-- Aforo -->
  <div class="flex flex-col w-full max-w-140">
    <label class="text-lg font-semibold">Aforo</label>
    <input
      type="number"
      :value="props.capacity"
      @input="emit('update:capacity', $event.target.value)"
      class="border border-gray-300 rounded px-4 py-4"
      placeholder="Ingresa el aforo"
      min="1"
    />
  </div>

  <!-- Nivel máximo de ruido -->
  <div class="flex flex-col w-full max-w-140 mt-4">
    <div class="flex items-center justify-between">
      <label class="text-lg font-semibold">Nivel máx. de ruido (dB)</label>
      <input type="checkbox" v-model="noiseMonitorActive" class="w-6 h-6" />
    </div>
    <input
      v-if="noiseMonitorActive"
      type="number"
      v-model="localNoiseLevel"
      class="border border-gray-300 rounded px-4 py-4 mt-2"
      placeholder="Ingresa el nivel máximo permitido"
      min="1"
    />
  </div>

  <!-- Detección de humo -->
  <div class="flex flex-col w-full max-w-140 mt-4">
    <div class="flex items-center justify-between">
      <label class="text-lg font-semibold">Activar detección de humo</label>
      <input type="checkbox" v-model="smokeMonitorActive" class="w-6 h-6" />
    </div>
    <p v-if="smokeMonitorActive" class="text-sm text-green-600 mt-1">
      ✅ El monitoreo de humo está activo.
    </p>
  </div>

  <!-- Área restringida -->
  <div class="flex flex-col w-full max-w-140 mt-4">
    <div class="flex items-center justify-between">
      <label class="text-lg font-semibold">Área restringida a monitorear</label>
      <input type="checkbox" v-model="restrictedAreaMonitorActive" class="w-6 h-6" />
    </div>
    <input
      v-if="restrictedAreaMonitorActive"
      type="text"
      v-model="localRestrictedArea"
      class="border border-gray-300 rounded px-4 py-4 mt-2"
      placeholder="Ingresa el nombre del área restringida"
    />
  </div>

  <!-- Características -->
  <div class="flex flex-col w-full max-w-140 mt-6">
    <label class="text-lg font-semibold">Características</label>
    <div class="flex items-center gap-2 mt-2">
      <input
        v-model="newFeature"
        @keyup.enter="addFeature"
        type="text"
        placeholder="Agregar característica"
        class="flex-1 border border-gray-300 rounded px-3 py-2"
      />
      <button
        @click="addFeature"
        class="text-xl font-bold px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 border"
      >
        +
      </button>
    </div>

    <ul class="mt-4 space-y-2">
      <li
        v-for="(feature, index) in props.features"
        :key="index"
        class="flex items-center justify-between border-b pb-1"
      >
        <span>• {{ feature }}</span>
        <button
          @click="removeFeature(index)"
          class="text-red-500 hover:text-red-700 text-sm"
          title="Eliminar"
        >
          🗑️
        </button>
      </li>
    </ul>
  </div>
</template>
