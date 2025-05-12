<script setup>
const props = defineProps({
  country: String,
  city: String,
  district: String,
  street: String,
});

const emit = defineEmits([
  'update:country',
  'update:city',
  'update:district',
  'update:street'
]);

</script>

<template>
  <h1 class="text-3xl text-center font-semibold">Confirma tu dirección</h1>
  <p class="text-lg text-center">Será de utilidad para que otros usuarios puedan encontrar tu espacio con facilidad.</p>

  <div class="flex flex-col w-full max-w-140">
    <label for="country" class="bg-(--background-color) w-12 text-lg font-semibold relative top-4 left-2 px-2">País</label>
    <input
      type="text"
      id="country"
      :value="props.country"
      @input="emit('update:country', $event.target.value)"
      class="border border-gray-300 rounded px-4 py-4"
      placeholder="Ingresa tu país"
    />
  </div>

  <div class="flex flex-col w-full max-w-140">
    <label for="city" class="bg-(--background-color) w-36 text-lg font-semibold relative top-4 left-2 px-2">Departamento</label>
    <input
      type="text"
      id="city"
      :value="props.city"
      @input="emit('update:city', $event.target.value)"
      class="border border-gray-300 rounded px-4 py-4"
      placeholder="Ingresa tu departamento"
    />
  </div>

  <div class="flex flex-col w-full max-w-140">
    <label for="district" class="bg-(--background-color) w-20 text-lg font-semibold relative top-4 left-2 px-2">Distrito</label>
    <input
      type="text"
      id="district"
      :value="props.district"
      @input="emit('update:district', $event.target.value)"
      class="border border-gray-300 rounded px-4 py-4"
      placeholder="Ingresa tu distrito"
    />
  </div>

  <div class="flex flex-col w-full max-w-140">
    <label for="street" class="bg-(--background-color) w-72 text-lg font-semibold relative top-4 left-2 px-2">Número, edificio, departamento</label>
    <input
      type="text"
      id="street"
      :value="props.street"
      @input="emit('update:street', $event.target.value)"
      class="border border-gray-300 rounded px-4 py-4"
      placeholder="Ingresa tu dirección"
    />
  </div>
</template>