<script setup>
import { onMounted, ref } from 'vue';
import { useAuthenticationStore } from '../../auth/services/authentication.store';
import { LocalsApiService } from '../../locals/services/locals-api.service';
import { RouterLink } from 'vue-router';

const authenticationStore = useAuthenticationStore();
const localsApiService = new LocalsApiService();

const locals = ref([]);

onMounted(async () => {
  try {
    const userId = authenticationStore.userId;
    const response = await localsApiService.getUserLocals(userId);
    locals.value = response;
  } catch (error) {
    console.error('Error fetching published spaces:', error);
  }
});

</script>

<template>
  <div v-if="locals" class="w-full p-4 flex flex-col gap-10">
    <h2 class="text-xl md:text-4xl font-bold text-center mb-6">
      Espacios publicados
    </h2>
    <div class="w-full flex justify-center items-center">
      <div v-if="locals.length === 0" class="w-full flex items-center justify-center">
        <p class="text-lg text-center">No tienes espacios publicados aún.</p>
      </div>
    </div>  
    <div v-for="local in locals" :key="local.id" class="w-full px-10 py-4 bg-(--background-color) shadow-md rounded-lg flex items-center justify-between hover:shadow-2xl transition duration-300 ease-in-out">
      <div class="flex gap-4 w-full">
        <img :src="local.photoUrl" alt="Local Image" class="w-32 h-32 object-cover rounded-lg" />
        <div class="flex flex-col justify-center gap-4 w-full">
          <p class="text-xl font-semibold">{{ local.streetAddress }}</p>
          <p>{{ `Precio: S/.${local.nightPrice}` }}</p>
          <p class="text-xl font-semibold">{{ local.cityPlace }}</p>
        </div>
        <div class="flex flex-col items-center justify-center gap-2">
          <RouterLink :to="`/local/${local.id}`" class="w-52 px-4 py-2 bg-(--button-color) text-xl text-(--text-button-color) text-center rounded-md hover:cursor-pointer">
            Ver detalles
          </RouterLink>
          <RouterLink :to="`/monitoring/${local.id}`" class="w-52 px-4 py-2 bg-(--secondary-color) text-xl text-white text-center rounded-md hover:bg-(--secondary-color-hover) hover:cursor-pointer">
            Monitorear
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>