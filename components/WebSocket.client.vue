<template>
  <div class="flex items-center">
    <div>
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
    </div>
    <div v-if="room">
      <BoardElement v-for="(element, idx) in room.elements" :key="idx" :element="element" @update-element="onElementUpdated" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BoardElement } from "~/types";
const { currentName, history, sendData, initMe, room, updateElement } = useWebsocket();

const props = defineProps<{
  roomId: string;
}>();

const message = ref("");

const send = (data: { type: string; data: string }) => {
  sendData(data);
  message.value = "";
};

const onElementUpdated = (element: BoardElement) => {
  console.log("element updated", element);
  updateElement(element);
};

onMounted(() => {
  initMe(props.roomId);
});
</script>
