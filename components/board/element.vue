<template>
  <vue-resizable :width="width" :height="height" :left="x" :top="y" :minWidth="150" :minHeight="150" :fitParent="true" @drag:start="isDragging = true" @drag:end="endHandler" @resize:start="isResizing = true" @resize:end="endHandler" class="border flex flex-col rounded-md shadow-lg" style="position: absolute" :dragSelector="dragSelector" ref="el" :class="[colors[element.color], { 'transition-all ease-in-out delay-200': !isDragging && !isResizing }]">
    <div class="drag-handle select-none flex items-center justify-end space-x-3 rounded-t-md cursor-move inset-0 w-full h-6 bg-yellow-500 bg-[radial-gradient(#fde047_1px,transparent_1px)] [background-size:5px_5px]">
      <small class="text-gray-600 text-xs">(x: {{ Math.round(x) }}, y: {{ Math.round(y) }})</small>
      <small class="text-gray-600 text-xs">(h: {{ Math.round(height) }}, w: {{ Math.round(width) }})</small>
    </div>
    <div v-on:dblclick="editIsOpen = true" class="p-3 bg-transparent border-0 w-full h-full resize-none focus:outline-0 overflow-y-auto">{{ content }}</div>
  </vue-resizable>
  <board-edit-element v-model:isOpen="editIsOpen" v-bind:element="element" @close="editIsOpen = false" @update-element="(val: BoardElement) => $emit('updateElement', val)" />
</template>

<script setup lang="ts">
import VueResizable from "vue-resizable";
import type { BoardElement } from "~/types";

const props = defineProps<{
  element: BoardElement;
}>();
const emit = defineEmits(["updateElement"]);

const x = ref(props.element.position.x);
const y = ref(props.element.position.y);
const width = ref(props.element.size.width);
const height = ref(props.element.size.height);
const content = ref(props.element.content);

const isDragging = ref(false);
const isResizing = ref(false);
const editIsOpen = ref(false);
const dragSelector = ".drag-handle";

watch(props, (val) => {
  x.value = val.element.position.x;
  y.value = val.element.position.y;
  width.value = val.element.size.width;
  height.value = val.element.size.height;
  content.value = val.element.content;
});

const endHandler = (data) => {
  x.value = data.left;
  y.value = data.top;
  width.value = data.width;
  height.value = data.height;
  isDragging.value = false;
  isResizing.value = false;
  emit("updateElement", { ...props.element, position: { x: x.value, y: y.value }, size: { width: width.value, height: height.value } });
};
</script>

<style scoped></style>
