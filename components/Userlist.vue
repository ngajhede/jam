<template>
  <ul class="flex items-center space-x-4">
    <li v-for="user in currentRoom?.users" :key="user.id">
      <div class="flex items-center space-x-2">
        <div class="w-6 h-6 rounded-full">
          <!-- Just the first letter of the name, 2 letters if more than 1 word -->
          <span>{{ user.name.split(' ').map((word) => word[0]).join('') }}</span>
        </div>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
const { currentRoom } = storeToRefs(useConnectionStore())

</script>

<style scoped>

</style>
