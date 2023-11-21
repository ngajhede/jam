<template>
  <div>
    <div v-if="currentRoom && currentRoom.items.length" class="relative">
      <Stickynote
        v-for="item in currentRoom.items"
        :key="item.id"
        :item="item"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { currentRoom } = storeToRefs(useConnectionStore())
</script>

<style scoped>

</style>
