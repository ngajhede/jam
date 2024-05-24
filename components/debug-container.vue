<template>
  <div class="absolute right-6 bottom-6 flex flex-col justify-between space-y-3 w-64 h-96 bg-gray-800 p-3 text-white rounded-md shadow-lg z-10 text-sm">
    <div class="flex justify-between items-center">
      <p>{{ currentName }}</p>
      <button class="hover:underline" @click="logout">Logout</button>
    </div>

    <ul class="h-full border border-gray-700 p-3 rounded-md overflow-y-scroll" ref="chat">
      <li class="break-all" v-for="msg in history" :key="msg">{{ msg }}</li>
    </ul>

    <form @submit.prevent="sendMessage(message)" class="flex justify-between items-center space-x-3">
      <input v-model="message" type="text" placeholder="Type a message..." class="p-2 w-full rounded-md bg-gray-700" />
      <button class="border border-gray-700 bg-gray-700 px-3 py-2 hover:bg-gray-600 transition duration ease-linear" type="submit">Send</button>
    </form>
  </div>
</template>

<script setup lang="ts">
const { logout } = useAuth();
const props = defineProps<{
  currentName: string;
  history: string[];
  room: any;
}>();
const emit = defineEmits(["send-message"]);

const message = ref("");
const chat = ref<HTMLDivElement | null>(null);

const sendMessage = (msg: string) => {
  if (!msg.length) return;
  emit("send-message", {
    type: "message",
    data: msg,
  });
  message.value = "";
};

watch(props.history, async () => {
  await nextTick();
  chat.value?.scrollTo(0, chat.value.scrollHeight);
});
</script>

<style scoped></style>
