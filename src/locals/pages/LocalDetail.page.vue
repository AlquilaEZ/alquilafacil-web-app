<script setup>
import NavbarComponent from '../../public/components/Navbar.component.vue';
import { ref, computed, onMounted } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { LocalsApiService } from '../services/locals-api.service';
import { LocalResponse } from '../model/local.response';
import { ReservationRequest } from '../../booking/models/reservation.request';
import { useAuthenticationStore } from '../../auth/services/authentication.store';
import { ReservationsApiService } from '../../booking/services/reservations-api.service';
import { ProfilesApiService } from '../../profile/services/profiles-api.service';
import FooterComponent from '../../public/components/Footer.component.vue';

const route = useRoute();
const authenticationStore = useAuthenticationStore();

const localsApiService = new LocalsApiService();
const reservationsApiService = new ReservationsApiService();
const profilesApiService = new ProfilesApiService();

const local = ref({});
const bankAccounts = ref({});
const startDate = ref('');
const endDate = ref('');
const voucherImageUrl = ref('');
const isLoaded = ref(false);

onMounted(async () => {
  const id = parseInt(route.params.id);
  const response = await localsApiService.getById(id);
  local.value = new LocalResponse(response);
  bankAccounts.value = await profilesApiService.getBankAccountsByUserId(local.value.userId);
  isLoaded.value = true; // Cuando se cargan los datos
});

const now = () => new Date().toISOString().slice(0, 16);

const isStartDateValid = computed(() => {
  return startDate.value && startDate.value >= now();
});

const isEndDateValid = computed(() => {
  return (
    endDate.value &&
    startDate.value &&
    endDate.value > startDate.value
  );
});

const isFormValid = computed(() => isStartDateValid.value && isEndDateValid.value);

const totalAmountToPay = computed(() => {
  if (isFormValid.value) {
    const start = new Date(startDate.value);
    const end = new Date(endDate.value);
    const diffInMs = end.getTime() - start.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    return Math.round(diffInHours * local.value.nightPrice * 100) / 100; // Redondear a 2 decimales
  }
  return 0.00;
});

const openUploadWidget = async () => {
  voucherImageUrl.value = 'https://res.cloudinary.com/ducsr2p2w/image/upload/v1745502933/casa-de-playa_cwyb1z.jpg';

  /*
  try {
    const secureUrl = await cloudinaryWidget();
    console.log("URL segura:", secureUrl);
    emit('update:photoUrl', secureUrl);
  } catch (error) {
    console.error("Error al subir imagen:", error);
  }
  */
};

const reserveLocal = async () => {
  try {
    const localStartDate = new Date(startDate.value);
    const localEndDate = new Date(endDate.value);

    // Ajustar las fechas a UTC pero sin cambiar la hora (eliminando la zona horaria local)
    const startDateUTC = new Date(localStartDate.getTime() - localStartDate.getTimezoneOffset() * 60000);
    const endDateUTC = new Date(localEndDate.getTime() - localEndDate.getTimezoneOffset() * 60000);

    // Convertir las fechas a formato ISO, pero en UTC sin el ajuste de zona horaria (sin añadir 5 horas)
    const formattedStartDate = startDateUTC.toISOString();
    const formattedEndDate = endDateUTC.toISOString();

    // Crear la solicitud de reserva con las fechas formateadas
    const reservationRequest = new ReservationRequest({
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      localId: local.value.id,
      userId: authenticationStore.userId,
      price: totalAmountToPay.value,
      voucherImageUrl: voucherImageUrl.value,
    });
    console.log(reservationRequest);
    await reservationsApiService.create(reservationRequest);
    alert('Reserva realizada correctamente');
  } catch (error) {
    console.error('Error al reservar el local:', error);
    alert('Error al reservar el local. Por favor, inténtelo de nuevo más tarde.');
  }
};
</script>

<template>
  <NavbarComponent />
  <main class="px-4 sm:px-8 md:px-10 lg:px-16 py-10 w-full min-h-[80dvh] flex flex-col gap-6">
    <h1 class="text-3xl font-semibold">Detalles del local:</h1>

    <div class="w-full flex flex-col md:flex-row gap-6">
      <div class="w-full md:w-2/3 flex flex-col shadow-lg bg-white rounded-lg p-4">
        <img :src="local.photoUrl" alt="Imagen del local" class="w-full h-90 object-cover rounded-lg" />
        <h2 class="text-xl font-semibold mt-4">{{ local.localName }}</h2>
        <p class="text-lg mt-6">{{ `${local.streetAddress}, ${local.cityPlace}` }}</p>
        <p class="text-[var(--text-button-color)] mt-3">{{ `Aforo: ${local.capacity} personas` }}</p>
        <p class="mt-3"><span class="font-bold">Propietario: </span>{{ local.userUsername }}</p>
        <p class="font-bold mt-3">Descripción:</p>
        <p class="text-justify">{{ local.descriptionMessage }}</p>
        <p class="font-bold mt-3">Características</p>
        <ul class="list-disc list-inside text-justify">
          <li v-for="(feature, index) in local.features" :key="index" class="text-lg">{{ feature }}</li>
        </ul>
      </div>

      <!-- Panel lateral -->
      <div class="flex flex-col justify-center gap-4 shadow-lg bg-white rounded-lg p-4 w-full md:w-1/3  overflow-y-auto">
        <h2 class="text-2xl font-semibold">Opciones:</h2>
        <div class="flex flex-col gap-5 text-xl">
          <RouterLink :to="`/comments/${local.id}`" class="text-[var(--primary-color)] hover:underline">
            Ver comentarios >
          </RouterLink>
          <RouterLink :to="`/report/${local.id}`" class="text-[var(--primary-color)] hover:underline">
            Reportar espacio >
          </RouterLink>
        </div>

        <!-- Fechas -->
        <div v-if="isLoaded && authenticationStore.userId !== local.userId" class="flex flex-col gap-5">
          <div class="flex gap-4 justify-between items-center">
            <p class="text-xl">Fecha y hora de inicio:</p>
            <input
              type="datetime-local"
              class="w-1/2 p-2 border-2 caret-[var(--color-primary)] rounded-lg"
              v-model="startDate"
            />
          </div>
          <p v-if="startDate && !isStartDateValid" class="text-red-500 text-sm">
            La fecha de inicio debe ser mayor o igual al momento actual.
          </p>

          <div class="flex gap-4 justify-between items-center">
            <p class="text-xl">Fecha y hora de fin:</p>
            <input
              type="datetime-local"
              class="w-1/2 p-2 border-2 caret-[var(--color-primary)] rounded-lg"
              v-model="endDate"
            />
          </div>
          <p v-if="endDate && !isEndDateValid" class="text-red-500 text-sm">
            La fecha de fin debe ser posterior a la fecha de inicio.
          </p>
        </div>
        <div v-if="isFormValid" class="bg-gray-100 p-4 rounded-lg mt-4 flex flex-col items-center">
          <h3 class="text-xl font-semibold mb-2">Cuenta del propietario:</h3>
          <ul class="flex flex-col gap-2">
            <p><span class="font-bold">Número de cuenta:</span> {{ bankAccounts.bankAccountNumber }}</p>
            <p><span class="font-bold">Número de cuenta interbancaria:</span> {{ bankAccounts.interbankAccountNumber }}</p>
            <p><span class="font-bold">Cantidad a depositar:</span> S/.{{ totalAmountToPay }}</p>
          </ul>
          <button @click="openUploadWidget" class="flex flex-col p-10 shadow-2xl hover:cursor-pointer">
            <img src="/svgs/camera.svg" alt="camera" class="w-1/2 max-w-30 mx-auto mt-4" />
            <span class="text-center text-gray-700 text-2xl">Adjuntar imagen del voucher</span>
          </button>
        </div>
        <!-- Botón -->
        <button v-if="isLoaded &&authenticationStore.userId !== local.userId"
          :disabled="!isFormValid || !voucherImageUrl"
          class="bg-[var(--secondary-color)] rounded-md py-5 text-white text-xl hover:cursor-pointer hover:bg-[var(--secondary-color-hover)] transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          @click="reserveLocal"
        >
          Reservar
        </button>
      </div>
    </div>
  </main>
  <FooterComponent />
</template>