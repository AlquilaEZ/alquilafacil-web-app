<script setup>
const props = defineProps({
  localCategory: Object,
  isSelected: Boolean,
});
</script>

<template>
  <div
    class="flex flex-col p-4 gap-6 rounded-md shadow-2xl border-4 hover:cursor-pointer transition-all"
    :class="isSelected ? 'border-(--primary-color)' : 'border-transparent'"
  >
    <img
      :src="localCategory.photoUrl"
      alt="Local Category Image"
      class="w-full h-40 object-cover rounded-lg"
    />
    <p class="text-center text-xl">
      {{ localCategory.name }}
    </p>
  </div>
</template>
