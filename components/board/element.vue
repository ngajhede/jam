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
    @drag:start="isDragging = true"
    @drag:end="endHandler"
    @resize:start="isResizing = true"
    @resize:end="endHandler"
    :fit-parent="true"
    class="border p-3 bg-yellow-400 rounded-md shadow-lg"
    :dragSelector="dragSelector"
    ref="el"
    :class="{
      'transition-all ease-in-out delay-200': !isDragging && !isResizing,
    }"
  >
    <div class="resizable-content">
      <div class="drag-handle">Drag me</div>
      I am at {{ Math.round(x) }}, {{ Math.round(y) }}. Size: ({{ height }}, {{ width }}) Content: {{ element.content }}
    </div>
  </vue-resizable>
</template>

<style scoped>
.resizable-content {
  height: 100%;
  width: 100%;
  background-color: aqua;
}
</style>
