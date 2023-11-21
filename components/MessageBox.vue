<template>
  <div class="bg-zinc-800 w-96 ">
    <div class="flex items-center justify-between">
      <p>Current room: {{ currentRoom?.id ?? 'None' }}</p>
      <button @click="sendMessage">
        Send message
      </button>
    </div>
    <hr>
    <p>
      {{ messages[messages.length - 1] }}
    </p>
  </div>
</template>

<script setup lang="ts">
const { currentRoom, messages } = storeToRefs(useConnectionStore())
const { $io } = useNuxtApp()

const sendMessage = () => {
  $io.emit('message', currentRoom.value?.id, 'Hello world')
}
</script>

<style scoped>

</style>
