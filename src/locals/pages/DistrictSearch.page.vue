<script setup>
  import { onMounted, ref } from 'vue';

  import NavbarComponent from '@/public/components/Navbar.component.vue'
  import LocalCardComponent from '../components/LocalCard.component.vue';
  import { LocalsApiService } from '../services/locals-api.service';
import { useRouter } from 'vue-router';
import FooterComponent from '../../public/components/Footer.component.vue';

  const locals = ref([]);
  const localsApiService = new LocalsApiService();
  const router = useRouter();

  onMounted(async () => {
    locals.value = await localsApiService.getAll();
    const district = localStorage.getItem('district');

    if (district) {
      const normalize = (str) =>
        str
          .toLowerCase()
          .split(',')
          .map(s => s.trim());

      const districtParts = normalize(district);

      locals.value = locals.value.filter(local => {
        const cityParts = normalize(`${local.streetAddress}, ${local.cityPlace}`);
        return districtParts.every(part => cityParts.includes(part));
      });
    }
  });

  const goToFilters = () => {
    router.push('/filters');
  }; 
</script>

<template>
  <NavbarComponent />
  <main class="px-4 sm:px-8 md:px-10 lg:px-16 py-10 w-full min-h-[80dvh] flex flex-col gap-6">
    <div class="w-full flex items-center justify-between">
      <h1 class="text-3xl text-center font-semibold">Resultados de búsqueda:</h1>
      <button @click="goToFilters" type="button" class="px-8 py-2 bg-(--button-color) text-(--text-button-color) rounded-md hover:cursor-pointer">
        Filtros
      </button>
    </div>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <LocalCardComponent v-for="local in locals" :key="local.id" :local="local" />      
    </div>

  </main>
  <FooterComponent />
</template>