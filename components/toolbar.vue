<template>
  <div class="absolute bottom-6 flex items-center justify-between w-full">
    <div class="mx-auto p-2 rounded-xl bg-gray-100 border shadow">
      <button class="hover:bg-gray-300 hover:bg-opacity-25 p-3 rounded-md" @click="addElementOpen = true">
        <StickyNote class="w-8 h-8 text-yellow-600 fill-yellow-300" />
      </button>
    </div>
  </div>
  <BoardAddElement v-model:isOpen="addElementOpen" @close="addElementOpen = false" @add-element="(val) => $emit('add-element', val)" />
</template>

<script setup lang="ts">
import { StickyNote } from "lucide-vue-next";

const emit = defineEmits(["add-element"]);

const addElementOpen = ref(false);
</script>

<style scoped></style>
