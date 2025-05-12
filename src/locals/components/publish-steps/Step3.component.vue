
<script setup>
import { onMounted, ref } from 'vue';
import { LocalCategoriesApiService } from '../../services/local-categories-api.service';
import LocalCategoryCardComponent from '../LocalCategoryCard.component.vue';

const props = defineProps({
  localCategoryId: Number
});
const emit = defineEmits(['update:localCategoryId']);

const localCategories = ref([]);
const localCategoriesApiService = new LocalCategoriesApiService();

const selectCategory = (id) => {
  emit('update:localCategoryId', id);
};

onMounted(async ()=> {
  try {
    localCategories.value = await localCategoriesApiService.getAll();
    console.log(localCategories.value)
  } catch (error) {
    console.error('Error cargando categorías:', error);
  }
});

</script>

<template>
  <h1 class="text-3xl text-center font-semibold">¿Cuál de estas opciones describe mejor tu espacio?</h1>
  <div class="grid sm:grid-cols-2 gap-4">
    <LocalCategoryCardComponent
      v-for="localCategory in localCategories"
      :key="localCategory.id"
      :localCategory="localCategory"
      :isSelected="localCategory.id === props.localCategoryId"
      @click="selectCategory(localCategory.id)"
    />
  </div>
</template>