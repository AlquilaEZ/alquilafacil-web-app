<script setup>
const props = defineProps({
  localData: Object
});
</script>


<template>
  <h1 class="text-3xl text-center font-semibold">¡Es todo!</h1>
  <p class="text-lg text-center">Esto es lo que verán los demás.</p>
  <div class="flex flex-col gap-4 max-w-90 p-8 shadow-2xl">
    <img :src="localData.photoUrl" alt="Imagen del local" class="rounded-md max-w-80">
    <h1 class="text-xl font-semibold">{{ `${localData.district}, ${localData.city}`}} </h1>
    <h2 class="text-lg text-gray-600 font-medium">{{ localData.localName }}</h2>
    <p class="text-lg">S/.{{ localData.price }}/hora</p>
  </div>
</template>