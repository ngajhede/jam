<template>
  <div class="flex flex-col space-y-6 items-center justify-center h-screen bg-white bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
    <h1 class="text-4xl">🥫 Jam 🥫</h1>
    <div class="flex flex-col">
      <label for="room" class="text-gray-600">Room code</label>
      <input id="room" v-model="room" class="border px-2 py-1" placeholder="Code" />
      <nuxt-link :to="`/room/${room}`" class="bg-blue-500 hover:bg-blue-600 transition duration-75 ease-linear text-white px-3 py-1 rounded-md mt-2 text-center">Join room</nuxt-link>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["protected"],
});

const room = ref("");

const { user, logout } = useAuth();
</script>

<style scoped></style>
