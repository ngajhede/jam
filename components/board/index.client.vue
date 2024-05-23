<template>
  <div class="h-full bg-gray-100 relative">
    <DebugContainer :history="history" :room="room" :current-name="currentName" @send-message="send" />
    <BoardContainer v-if="room">
      <BoardElement v-for="(element, idx) in room.elements" :key="idx" :element="element" @update-element="onElementUpdated" />
    </BoardContainer>
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
  updateElement(element);
};

onMounted(() => {
  initMe(props.roomId);
});
</script>
