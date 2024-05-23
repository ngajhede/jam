<template>
  <div class="absolute right-6 bottom-6 flex flex-col justify-between space-y-3 w-64 h-96 bg-gray-800 p-3 text-white rounded-md shadow-lg z-10">
    <p>Name: {{ currentName }}</p>

    <ul class="h-full border border-gray-700 p-3 rounded-md">
      <li v-for="msg in history" :key="msg">{{ msg }}</li>
    </ul>

    <form
      @submit.prevent="
        $emit('send-message', {
          type: 'message',
          data: message,
        })
      "
    >
      <input v-model="message" type="text" placeholder="Type a message..." class="p-2 rounded-md bg-gray-700" />
      <button type="submit">Send</button>
    </form>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  currentName: string;
  history: string[];
  room: any;
}>();
const emit = defineEmits(["send-message"]);

const message = ref("");
</script>

<style scoped></style>
