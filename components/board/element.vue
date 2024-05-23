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
const dragSelector = ".drag-handle";

watch(props, (val) => {
  console.log("props changed", val);
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

<template>
  <vue-resizable
    :width="width"
    :height="height"
    :left="x"
    :top="y"
    :minWidth="150"
    :minHeight="150"
    @drag:start="isDragging = true"
    @drag:end="endHandler"
    @resize:start="isResizing = true"
    @resize:end="endHandler"
    :fit-parent="true"
    class="border flex flex-col bg-yellow-400 rounded-md shadow-lg hover:border-1 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
    :dragSelector="dragSelector"
    ref="el"
    :class="{
      'transition-all ease-in-out delay-200 ': !isDragging && !isResizing,
    }"
  >
    <div class="drag-handle select-none flex items-center justify-end space-x-3 rounded-t-md cursor-move inset-0 w-full h-6 bg-yellow-500 bg-[radial-gradient(#fde047_1px,transparent_1px)] [background-size:5px_5px]">
      <small class="text-gray-600 text-xs">(x: {{ Math.round(x) }}, y: {{ Math.round(y) }})</small>
      <small class="text-gray-600 text-xs">(h: {{ height }}, w: {{ width }})</small>
    </div>
    <textarea class="p-3 bg-transparent border-0 w-full h-full resize-none focus:outline-0" v-model="content" />
  </vue-resizable>
</template>

<style scoped>
.resizable-content {
  height: 100%;
  width: 100%;
}
</style>
