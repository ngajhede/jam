<template>
  <div ref="parent" class="parent relative w-full">
    <div class="mx-auto border p-3 rounded-md bg-white bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" :style="{ transform: transformStyle, transformOrigin: 'top left', width: '1920px', height: '1200px' }">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue";

const transformStyle = ref("scale(1)");
const parent = ref<HTMLDivElement | null>(null);

const updateScale = (parentWidth: number, parentHeight: number) => {
  const targetWidth = 1920;
  const targetHeight = 1200;
  const scale = Math.min(parentWidth / targetWidth, parentHeight / targetHeight);
  transformStyle.value = `scale(${scale})`;
};

onMounted(() => {
  if (parent.value) {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        updateScale(width, height);
      }
    });
    observer.observe(parent.value);

    // Initial scale update
    const { width, height } = parent.value.getBoundingClientRect();
    updateScale(width, height);

    // Clean up on unmount
    onBeforeUnmount(() => {
      if (parent.value) {
        observer.unobserve(parent.value);
      }
    });
  }
});
</script>

<style scoped></style>
