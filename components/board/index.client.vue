<template>
  <div class="h-full bg-gray-100 relative">
    <BoardContainer v-if="room">
      <Participants :peers="room?.peers" />
      <div class="absolute p-3 top-0 right-0">
        <p>Double click content to edit</p>
        <p>Drag top of notes to move</p>
        <p>Drag corners of notes to resize</p>
      </div>
      <BoardElement v-for="element in room.elements" :key="element.id" :element="element" @update-element="onElementUpdated" />
      <Toolbar @add-element="onElementAdded" />
    </BoardContainer>
    <DebugContainer :history="history" :room="room" :current-name="currentName" @send-message="send" />
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
