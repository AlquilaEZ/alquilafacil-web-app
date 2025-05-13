<script setup>
import { cloudinaryWidget } from '../../../shared/components/cloudinary-widget';


const props = defineProps({
  photoUrl: String,
});

const emit = defineEmits([
  'update:photoUrl',
]);


const openUploadWidget = async () => {
  emit('update:photoUrl', 'https://res.cloudinary.com/ducsr2p2w/image/upload/v1745502933/casa-de-playa_cwyb1z.jpg');

  /*
  try {
    const secureUrl = await cloudinaryWidget();
    console.log("URL segura:", secureUrl);
    emit('update:photoUrl', secureUrl);
  } catch (error) {
    console.error("Error al subir imagen:", error);
  }
  */
}

</script>

<template>
  <h1 class="text-3xl text-center font-semibold">Agrega una foto de tu espacios</h1>
  <p class="text-lg text-center">Selecciona una imagen de tu galería para que represente.</p>
  <button @click="openUploadWidget" class="flex flex-col p-10 shadow-2xl hover:cursor-pointer">
    <img src="/svgs/camera.svg" alt="camera" class="w-1/2 max-w-110 mx-auto mt-4" />
    <span class="text-center text-gray-700 text-2xl">Añadir una imagen</span>
  </button>
</template>