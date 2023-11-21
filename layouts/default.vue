<template>
  <div class="bg-gray-900 h-full text-zinc-100">
    <MessageBox class="absolute right-5 bottom-5" />
    <slot />
  </div>
</template>

<script setup lang="ts">
const { leaveRoom } = useConnectionStore()

onUnmounted(() => {
  leaveRoom()
})
</script>

<style scoped>

</style>
