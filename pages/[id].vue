<template>
  <div>
    <Toolbar class="absolute z-10" />
    <Userlist class="absolute z-10 top-6 right-0" />
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
const route = useRoute()
const { currentRoom } = storeToRefs(useConnectionStore())
const { joinRoom } = useConnectionStore()

onMounted(() => {
  joinRoom(route.params.id as string)
})
</script>

<style scoped>

</style>
