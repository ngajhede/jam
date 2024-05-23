<script setup lang="ts">
import { ref } from "vue";
import { useDraggable } from "@vueuse/core";
import type { BoardElement } from "~/types";

const props = defineProps<{
  element: BoardElement;
}>();

const emit = defineEmits(["updateElement"]);

const el = ref<HTMLElement | null>(null);

// `style` will be a helper computed for `left: ?px; top: ?px;`
const { x, y, style, isDragging } = useDraggable(el, {
  initialValue: { x: props.element.x, y: props.element.y },
});

watch(props, () => {
  console.log("element changed", props.element);
  x.value = props.element.x;
  y.value = props.element.y;
});

watch(isDragging, (val) => {
  if (val) return;
  emit("updateElement", { ...props.element, x: x.value, y: y.value });
});
</script>

<template>
  <div
    class="border p-3 bg-yellow-400 rounded-md shadow-lg"
    ref="el"
    :class="{
      'transition-all ease-in-out delay-200': !isDragging,
    }"
    :style="style"
    style="position: fixed"
  >
    I am at {{ Math.round(x) }}, {{ Math.round(y) }}. Content: {{ element.content }}
  </div>
</template>

<style scoped></style>
