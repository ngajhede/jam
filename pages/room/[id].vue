<template>
  <div class="p-12 h-full">
    <Board :roomId="computedId" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["protected"],
});

const route = useRoute();

const id = route.params.id;
const computedId = computed(() => {
  if (typeof id === "string") {
    return id;
  } else {
    return id[0];
  }
});
</script>

<style scoped></style>
