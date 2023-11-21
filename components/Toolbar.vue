<template>
  <div class="p-3">
    <button class="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow" @click="add">
      Add Stickynote
    </button>
  </div>
</template>

<script setup lang="ts">
import { Types } from '~/types'

const { addItem } = useConnectionStore()

const add = () => {
  addItem(Types.Stickynote)
}
</script>

<style scoped>

</style>
