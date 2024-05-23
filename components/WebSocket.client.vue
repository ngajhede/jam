<template>
  <p>Name: {{ currentName }}</p>
  <p>Room: {{ roomId }}</p>

  <form
    @submit.prevent="
      send({
        type: 'message',
        data: message,
      })
    "
  >
    <input v-model="message" type="text" placeholder="Type a message..." />
    <button type="submit">Send</button>
  </form>

  <ul>
    <li v-for="msg in history" :key="msg">{{ msg }}</li>
  </ul>
</template>

<script setup lang="ts">
const { currentName, history, sendData, initMe } = useWebsocket();

const props = defineProps<{
  roomId: string;
}>();

const message = ref("");

const send = (data: { type: string; data: string }) => {
  sendData(data);
  message.value = "";
};

onMounted(() => {
  initMe(props.roomId);
});
</script>
