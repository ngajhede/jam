<template>
  <div class="h-full bg-gray-100 relative">
    <DebugContainer :history="history" :room="room" :current-name="currentName" @send-message="send" />
    <BoardContainer v-if="room" class="relative">
      <BoardElement class="absolute" v-for="element in room.elements" :key="element.id" :element="element" @update-element="onElementUpdated" />
    </BoardContainer>
    <Toolbar @add-element="onElementAdded" />
  </div>
</template>

<script setup lang="ts">
import type { BoardElement } from "~/types";
const { currentName, history, sendData, initMe, room, updateElement, addElement } = useWebsocket();

const props = defineProps<{
  roomId: string;
}>();

const message = ref("");

const send = (data: { type: string; data: string }) => {
  sendData(data);
  message.value = "";
};

const onElementAdded = (element: BoardElement) => {
  addElement(element);
};

const onElementUpdated = (element: BoardElement) => {
  updateElement(element);
};

onMounted(() => {
  initMe(props.roomId);
});
</script>
