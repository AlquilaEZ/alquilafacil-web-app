<script setup>
import { ref } from 'vue';

// Lista de preguntas frecuentes
const faqs = ref([
  {
    question: "¿Qué es AlquilaFácil?",
    answer: "AlquilaFácil es una plataforma que conecta a propietarios e inquilinos de manera rápida y segura.",
  },
  {
    question: "¿Qué hago si no encuentro propiedades disponibles en mi zona?",
    answer: "Recomendamos ajustar los filtros de búsqueda para encontrar más opciones.",
  },
  {
    question: "¿Cómo puedo registrar mi propiedad?",
    answer: "Puedes registrar tu propiedad completando los detalles de tu propiedad en la sección 'Registrar espacio'.",
  },
  {
    question: "¿Qué tipos de locales puedo publicar?",
    answer: "Puedes publicar cualquier tipo de local, desde apartamentos y casas hasta oficinas o locales comerciales.",
  },
  {
    question: "¿Es necesario pagar para usar AlquilaFácil?",
    answer: "Crear una cuenta es gratuito. Sin embargo, ofrecemos planes premium con beneficios adicionales.",
  },
  {
    question: "¿Cómo gestiono las reservas que han hecho en mi propiedad?",
    answer:
      "Dentro de la sección 'Calendario', podrás ver todas las reservas que han hecho en tus propiedades. Las que se encuentran resaltadas de color azul se pueden modificar o cancelar. Sin embargo, las reservas resaltadas de amarillo, que son hechas por usuarios premium, no se pueden modificar.",
  },
]);

// Controla cuál item está expandido
const expandedIndex = ref(null);

const toggleFaq = (index) => {
  expandedIndex.value = expandedIndex.value === index ? null : index;
};
</script>

<template>
  <div class="px-4 sm:px-6 md:px-12 lg:px-24 py-10 min-h-[80dvh] ">
    <h3 class="text-xl font-semibold text-center mb-8">Preguntas frecuentes</h3>

    <div class="max-w-3xl mx-auto space-y-4">
      <div
        v-for="(faq, index) in faqs"
        :key="index"
        class="border border-gray-300  rounded-md overflow-hidden"
      >
        <button
          @click="toggleFaq(index)"
          class="w-full text-left px-6 py-4 hover:cursor-pointer"
        >
          <span class="font-medium">{{ faq.question }}</span>
        </button>

        <div v-if="expandedIndex === index" class="px-6 py-4 bg-white ">
          <p class="text-sm">{{ faq.answer }}</p>
        </div>
      </div>
    </div>
  </div>

</template>
